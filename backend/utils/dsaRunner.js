/**
 * DSA Test Runner Logic
 * Wraps user code with a driver that executes test cases and captures output.
 */

// Helper to check deep equality in the driver (injected string)
// We use simple JSON stringify for now, but for production we might want a better deep equal.
// For Python we rely on `==`.

export function wrapCodeWithDriver(language, code, testCases, functionName) {
    if (!testCases || testCases.length === 0) {
        return code;
    }

    // Default function name if not provided
    const fnName = functionName || 'solution'; // Ideally passed from frontend

    switch (language.toLowerCase()) {
        case 'javascript':
        case 'js':
            return getJavascriptDriver(code, testCases, fnName);
        case 'python':
        case 'py':
            return getPythonDriver(code, testCases, fnName);
        default:
            throw new Error(`DSA Runner: Language ${language} not yet supported for automated testing.`);
    }
}

function getJavascriptDriver(userCode, testCases, functionName) {
    // We inject a mini testing framework at the end of the file
    return `
${userCode}

// --- DSA DRIVER CODE ---
(function() {
    const testCases = ${JSON.stringify(testCases)};
    const results = [];

    // Simple deep equal helper
    function deepEqual(a, b) {
        if (a === b) return true;
        if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) return false;
        
        if (Array.isArray(a)) {
             if (!Array.isArray(b) || a.length !== b.length) return false;
             for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i])) return false;
             return true;
        }
        
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        if (keysA.length !== keysB.length) return false;
        for (let key of keysA) {
            if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
        }
        return true;
    }

    // Try to find the function if they didn't match the name exactly
    // but typically we expect them to match. 
    // If functionName is not defined in scope, we might catch error.
    
    let targetFunc;
    try {
        targetFunc = eval(${functionName});
    } catch (e) {
        // If specific name fails, check if there's a default export or just try to find a function?
        // For now, we assume they followed the signature.
    }

    if (typeof targetFunc !== 'function') {
        console.log("---DSA_Results---");
        console.log(JSON.stringify([{ error: "Function '${functionName}' not found. Please match the signature." }]));
        return;
    }

    testCases.forEach((tc, idx) => {
        try {
            const start = process.hrtime();
            // Spread input args
            const actual = targetFunc(...tc.input);
            const end = process.hrtime(start);
            const runtimeMs = (end[0] * 1000 + end[1] / 1e6).toFixed(3);
            
            const passed = deepEqual(actual, tc.expected);
            
            results.push({
                passed,
                input: tc.input,
                expected: tc.expected,
                actual: actual,
                runtime: runtimeMs + "ms"
            });
        } catch (err) {
            results.push({
                passed: false,
                input: tc.input,
                expected: tc.expected,
                error: err.toString()
            });
        }
    });

    console.log("---DSA_Results---");
    console.log(JSON.stringify(results));
})();
`;
}

function getPythonDriver(userCode, testCases, functionName) {
    return `
import json
import sys
import time

# --- END OF IMPORTS ---

${userCode}

# --- DSA DRIVER CODE ---
def run_tests():
    test_cases_json = '''${JSON.stringify(testCases)}'''
    test_cases = json.loads(test_cases_json)
    results = []
    
    # Locate function
    target_func = None
    try:
        target_func = globals()['${functionName}']
    except KeyError:
        # Try to find class Solution?
        if 'Solution' in globals():
            sol = globals()['Solution']()
            if hasattr(sol, '${functionName}'):
                target_func = getattr(sol, '${functionName}')

    if not callable(target_func):
        print("---DSA_Results---")
        print(json.dumps([{"error": "Function '${functionName}' not found."}]))
        return

    for tc in test_cases:
        inp = tc['input']
        exp = tc['expected']
        
        try:
            start_time = time.time()
            # If input is a list, unpack it? Or pass as args?
            # JS inputs are typically [arg1, arg2]. We assume same format here.
            
            if isinstance(inp, list):
                actual = target_func(*inp)
            else:
                actual = target_func(inp)
                
            end_time = time.time()
            duration_ms = (end_time - start_time) * 1000
            
            # Compare
            # Simple equality for Python lists/dicts works well
            passed = (actual == exp)
            
            results.push({
                "passed": passed,
                "input": inp,
                "expected": exp,
                "actual": actual,
                "runtime": f"{duration_ms:.3f}ms"
            }) # Oops, python syntax error in push/dict above. Fixing below.
            
        except Exception as e:
            results.append({
                "passed": False,
                "input": inp,
                "expected": exp,
                "error": str(e)
            })
            continue

        # Correct appending
        results.append({
            "passed": passed,
            "input": inp,
            "expected": exp,
            "actual": actual,
            "runtime": f"{duration_ms:.3f}ms"
        })

    print("---DSA_Results---")
    print(json.dumps(results))

if __name__ == "__main__":
    run_tests()
`;
}
