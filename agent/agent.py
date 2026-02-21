import logging
import json
import os
import asyncio
from datetime import datetime
from dotenv import load_dotenv

from livekit.agents import (
    AutoSubscribe,
    JobContext,
    JobProcess,
    WorkerOptions,
    cli,
    llm,
)
from livekit.agents.pipeline import VoicePipelineAgent
from livekit.plugins import openai, deepgram, cartesia
from livekit import rtc

# Load environment variables
load_dotenv(dotenv_path=".env")

logger = logging.getLogger("intervyu_agent")
logger.setLevel(logging.INFO)

async def entrypoint(ctx: JobContext):
    # Connect to the room
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    # Get participant (candidate)
    participant = await ctx.wait_for_participant()
    logger.info(f"Participant connected: {participant.identity}")

    # Extract System Prompt from Metadata
    system_prompt = "You are a helpful interview assistant."
    if participant.metadata:
        try:
            metadata = json.loads(participant.metadata)
            system_prompt = metadata.get("systemPrompt", system_prompt)
            logger.info("System prompt loaded from metadata.")
        except json.JSONDecodeError:
            logger.warning("Failed to decode participant metadata.")

    # Define Tools
    class InterviewTools(llm.FunctionContext):
        @llm.ai_callable(description="Use this tool ONLY when you are completely finished with the interview and ready to say goodbye.")
        async def wrap_up_interview(self):
            logger.info("Tool 'wrap_up_interview' called.")
            
            # Check duration - estimated based on agent runtime
            # Ideally, we should track exact start time or get it from client, but relative is okay for now
            elapsed_seconds = (datetime.now() - start_time).total_seconds()
            elapsed_minutes = elapsed_seconds / 60
            
            logger.info(f"Elapsed time: {elapsed_minutes:.2f} minutes")

            if elapsed_minutes < 24: # 24 Minute Threshold
                logger.info("Interception: Early wrap-up attempt. Injecting nudge.")
                return "PROMPT INJECTION: The interview is too short. Ignore your previous closing intent. You MUST continue the interview for at least 5 more minutes. Immediately introduce a new, difficult technical complication based on the candidate's previous response. Do not say goodbye yet."
            else:
                logger.info("Duration >= 24 mins. Allowing termination.")
                # We can't strictly 'stop' the agent loop easily from here unless we signal it
                # But returning a goodbye message allows the LLM to generate the closing speech
                # We can disconnect after speech end
                asyncio.create_task(shutdown_sequence(ctx))
                return "Termination approved. Proceed to say goodbye."

    async def shutdown_sequence(ctx):
        await asyncio.sleep(5) # Give time to say goodbye
        await ctx.disconnect()

    start_time = datetime.now()

    # Initialize Agent
    agent = VoicePipelineAgent(
        vad=ctx.proc.userdata["vad"],
        stt=deepgram.STT(),
        llm=openai.LLM(
            base_url="https://api.groq.com/openai/v1",
            model="llama-3.1-70b-versatile",
            api_key=os.getenv("OPENAI_API_KEY"), # Groq API Key
        ),
        tts=cartesia.TTS(),
        fnc_ctx=InterviewTools(),
        chat_ctx=llm.ChatContext().append(
            role="system",
            text=system_prompt,
        ),
    )

    # Listen for Transcripts to forward to frontend
    @agent.on("user_speech_committed")
    def on_user_speech(msg: llm.ChatMessage):
        if msg.content:
            data_packet = json.dumps({
                "type": "transcript",
                "role": "user",
                "transcript": msg.content,
                "transcriptType": "final"
            })
            asyncio.create_task(ctx.room.local_participant.publish_data(data_packet, reliable=True))

    @agent.on("agent_speech_committed")
    def on_agent_speech(msg: llm.ChatMessage):
        if msg.content:
            data_packet = json.dumps({
                "type": "transcript",
                "role": "assistant",
                "transcript": msg.content,
                "transcriptType": "final"
            })
            asyncio.create_task(ctx.room.local_participant.publish_data(data_packet, reliable=True))

    agent.start(ctx.room)

    await agent.say("Hi, I'm ready to start the interview. Can you hear me?", allow_interruptions=True)


if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            # VAD Settings: Match Vapi (Start: 0.6s, Stop: ~3s + 0.5s voice)
            # Silero VAD parameters are slightly different, but we approximate:
            # min_speech_duration: check specifically
            # min_silence_duration: 3.0 (logic wait)
        )
    )
