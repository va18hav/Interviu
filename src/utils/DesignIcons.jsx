import React from 'react';
import { COMPONENT_TYPES } from './designComponentSchema';

// Common props for icons: size, color (optional override), className
const IconBase = ({ size = 24, color = "currentColor", className = "", children, viewBox = "0 0 24 24" }) => (
    <svg
        width={size}
        height={size}
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ color }}
    >
        {children}
    </svg>
);

// --- Basic Infrastructure ---

const ClientIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" fill="currentColor" />
    </IconBase>
);

const ApiGatewayIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M19 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.11 21 21 20.1 21 19V5C21 3.9 20.11 3 19 3ZM11 17H9V11H7V9H11V17ZM17 17H13V15H17V17ZM17 13H13V11H17V13ZM17 9H13V7H17V9Z" fill="currentColor" />
    </IconBase>
);

const LoadBalancerIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M18 4H6C4.9 4 4 4.9 4 6V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V6C20 4.9 19.1 4 18 4ZM8 16H6V8H8V16ZM12 16H10V8H12V16ZM16 16H14V8H16V16Z" fill="currentColor" opacity="0.8" />
        <path d="M2 12H4M20 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M7 6V2M17 6V2M7 22V18M17 22V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </IconBase>
);

const ServiceIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="8" rx="2" stroke="currentColor" strokeWidth="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M6 6H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M6 18H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </IconBase>
);

const BackgroundWorkerIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor" opacity="0.3" />
        <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
    </IconBase>
);

const CacheIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M4 6V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V6C20 4.9 19.1 4 18 4H6C4.9 4 4 4.9 4 6Z" stroke="currentColor" strokeWidth="2" />
        <path d="M8 8H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M8 16H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M18 2L6 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </IconBase>
);

const DatabaseIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M12 3C7.58 3 4 4.34 4 6V18C4 19.66 7.58 21 12 21C16.42 21 20 19.66 20 18V6C20 4.34 16.42 3 12 3ZM12 5C15.54 5 17.85 5.86 18 6.5C17.85 7.14 15.54 8 12 8C8.46 8 6.15 7.14 6 6.5C6.15 5.86 8.46 5 12 5ZM12 19C8.95 19 6.64 18.23 6.13 17.11C7.29 17.68 9.54 18 12 18C14.46 18 16.71 17.68 17.87 17.11C17.36 18.23 15.05 19 12 19ZM18 14.5C17.85 15.14 15.54 16 12 16C8.46 16 6.15 15.14 6 14.5V11.89C7.17 12.57 9.47 13 12 13C14.53 13 16.83 12.57 18 11.89V14.5ZM18 10.5C17.85 11.14 15.54 12 12 12C8.46 12 6.15 11.14 6 10.5V7.89C7.17 8.57 9.47 9 12 9C14.53 9 16.83 8.57 18 7.89V10.5Z" fill="currentColor" />
    </IconBase>
);

const MessageQueueIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M6 10H8V14H6V10Z" fill="currentColor" />
        <path d="M11 10H13V14H11V10Z" fill="currentColor" />
        <path d="M16 10H18V14H16V10Z" fill="currentColor" />
        <path d="M22 12H24" stroke="currentColor" strokeWidth="2" />
        <path d="M0 12H2" stroke="currentColor" strokeWidth="2" />
    </IconBase>
);

const ObjectStorageIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M20 18H4V8H20V18Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M4 8L12 3L20 8" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M8 21V18" stroke="currentColor" strokeWidth="2" />
        <path d="M16 21V18" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="13" r="2" fill="currentColor" />
    </IconBase>
);

const SearchIndexIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="currentColor" />
        <path d="M18 4H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M20 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </IconBase>
);

const CdnIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
        <path d="M12 4V2" stroke="currentColor" strokeWidth="2" />
        <path d="M12 22V20" stroke="currentColor" strokeWidth="2" />
        <path d="M4 12H2" stroke="currentColor" strokeWidth="2" />
        <path d="M22 12H20" stroke="currentColor" strokeWidth="2" />
        <path d="M12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8Z" fill="currentColor" />
    </IconBase>
);

const AuthServiceIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M8 11V7C8 4.79 9.79 3 12 3C14.21 3 16 4.79 16 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="16" r="2" fill="currentColor" />
    </IconBase>
);

const RateLimiterIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path d="M12 12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 7V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M7 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </IconBase>
);

const ConfigServiceIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M19.14 12.94C19.16 12.78 19.17 12.61 19.17 12.45C19.17 12.29 19.16 12.12 19.14 11.96L21.16 10.39C21.34 10.25 21.39 10.01 21.28 9.81L19.38 6.5C19.26 6.3 19.03 6.22 18.82 6.29L16.44 7.25C15.95 6.87 15.41 6.55 14.83 6.31L14.47 3.79C14.44 3.56 14.24 3.4 14.01 3.4H10.21C9.98 3.4 9.78 3.56 9.75 3.79L9.39 6.31C8.81 6.55 8.27 6.88 7.78 7.25L5.4 6.29C5.19 6.21 4.96 6.3 4.84 6.5L2.94 9.81C2.83 10.01 2.88 10.25 3.06 10.39L5.08 11.96C5.06 12.12 5.05 12.28 5.05 12.45C5.05 12.61 5.06 12.78 5.08 12.94L3.06 14.51C2.88 14.65 2.83 14.89 2.94 15.09L4.84 18.4C4.96 18.59 5.19 18.68 5.4 18.61L7.78 17.65C8.27 18.02 8.81 18.35 9.39 18.59L9.75 21.11C9.78 21.34 9.98 21.5 10.21 21.5H14.01C14.24 21.5 14.44 21.34 14.47 21.11L14.83 18.59C15.41 18.35 15.95 18.02 16.44 17.65L18.82 18.61C19.03 18.68 19.26 18.59 19.38 18.39L21.28 15.09C21.39 14.89 21.34 14.65 21.16 14.51L19.14 12.94ZM12.11 15.5C10.43 15.5 9.06 14.14 9.06 12.45C9.06 10.77 10.43 9.4 12.11 9.4C13.79 9.4 15.16 10.77 15.16 12.45C15.16 14.14 13.79 15.5 12.11 15.5Z" fill="currentColor" />
    </IconBase>
);

// --- Reliability Layer ---

const CircuitBreakerIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z" fill="currentColor" opacity="0.2" />
        <path d="M4 12H8L10 6L14 18L16 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 6L20 4M20 20L18 18" stroke="currentColor" strokeWidth="2" />
    </IconBase>
);

const RetryHandlerIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M12 4V1L8 5L12 9V6C15.31 6 18 8.69 18 12C18 13.01 17.75 13.97 17.3 14.8L18.76 16.26C19.54 15.03 20 13.57 20 12C20 7.58 16.42 4 12 4ZM12 18C8.69 18 6 15.31 6 12C6 10.99 6.25 10.03 6.7 9.2L5.24 7.74C4.46 8.97 4 10.43 4 12C4 16.42 7.58 20 12 20V23L16 19L12 15V18Z" fill="currentColor" />
    </IconBase>
);

const DeadLetterQueueIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M20 4H4C2.9 4 2 4.9 2 6V16C2 17.1 2.9 18 4 18H8L12 22L16 18H20C21.1 18 22 17.1 22 16V6C22 4.9 21.1 4 20 4ZM19 15L17.59 16.41L12 10.83L6.41 16.41L5 15L10.59 9.41L5 3.83L6.41 2.41L12 8L17.59 2.41L19 3.83L13.41 9.41L19 15Z" fill="currentColor" />
    </IconBase>
);

const FailoverRouterIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M15 13V15L12 18L9 15V13H15ZM12 6L15 9V11H9V9L12 6ZM4 12H2V10H4V12ZM4 14H2V16H4V14ZM20 12H22V10H20V12ZM20 14H22V16H20V14ZM6 18H4V20H6V18ZM18 18H20V20H18V18ZM6 4H4V6H6V4ZM18 4H20V6H18V4ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor" />
    </IconBase>
);

const ReplicationControllerIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21ZM13.5 13.5H17V11.5H13.5V9H11.5V11.5H8V13.5H11.5V17H13.5V13.5Z" fill="currentColor" />
    </IconBase>
);

const BackpressureControllerIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 4C13.66 4 15.14 4.54 16.36 5.45L5.45 16.36C4.54 15.14 4 13.66 4 12C4 7.59 7.59 4 12 4ZM12 20C10.34 20 8.86 19.46 7.64 18.55L18.55 7.64C19.46 8.86 20 10.34 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor" />
    </IconBase>
);

// --- Observability Layer ---

const MetricsPipelineIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M5 9.2L3 9.2L3 19L5 19L5 9.2ZM10.5 5L8.5 5L8.5 19L10.5 19L10.5 5ZM16 13L14 13L14 19L16 19L16 13ZM21.5 10L19.5 10L19.5 19L21.5 19L21.5 10Z" fill="currentColor" />
    </IconBase>
);

const LoggingPipelineIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20ZM10 17H16V15H10V17ZM10 13H16V11H10V13ZM10 9V7H12V9H10Z" fill="currentColor" />
    </IconBase>
);

const DistributedTracingIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M20.2 13C20.7 13 21.2 13.2 21.5 13.5L22.9 14.9C23.6 15.6 23.6 16.7 22.9 17.4L15.9 22.4C15.6 22.7 15.2 22.8 14.8 22.8H4C2.9 22.8 2 21.9 2 20.8V4.8C2 3.7 2.9 2.8 4 2.8H14.8C15.2 2.8 15.6 3 15.9 3.2L22.9 8.2C23.2 8.5 23.4 8.9 23.4 9.3C23.4 9.7 23.2 10.1 22.9 10.4L21.5 11.8C21.2 12.1 20.7 12.3 20.2 12.3H20.2V13ZM14 14H6V12H14V14ZM18 10H6V8H18V10ZM12 18H6V16H12V18Z" fill="currentColor" />
    </IconBase>
);

const AlertingEngineIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2 12 2C11.17 2 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16ZM16 17H8V11C8 8.52 9.51 6.5 12 6.5C14.49 6.5 16 8.52 16 11V17Z" fill="currentColor" />
    </IconBase>
);

const MonitoringDashboardIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M3 13H5V19H3V13ZM7 7H9V19H7V7ZM11 10H13V19H11V10ZM15 3H17V19H15V3ZM19 12H21V19H19V12ZM5 21H19V23H5V21Z" fill="currentColor" />
    </IconBase>
);

// --- Traffic Layer ---

const EdgeRouterIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M18 11C18 6.47 13.88 3.5 12.03 2.5L12 2.5L11.97 2.5C10.12 3.5 6 6.47 6 11V13.8C6 17.5 7.82 20.61 12 22C16.18 20.61 18 17.5 18 13.8V11ZM12 20C8.94 18.82 8 16.43 8 13.8V11.75C8 8.85 10.66 6.7 12 6.01C13.34 6.7 16 8.85 16 11.75V13.8C16 16.43 15.06 18.82 12 20Z" fill="currentColor" />
        <path d="M12 16L10 14H14L12 16Z" fill="currentColor" />
    </IconBase>
);

const GeoRouterIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 4C14.76 4 17 6.24 17 9C17 11.88 14.12 16.19 12 18.88C9.92 16.21 7 11.85 7 9C7 6.24 9.24 4 12 4ZM12 6.5C10.62 6.5 9.5 7.62 9.5 9C9.5 10.38 10.62 11.5 12 11.5C13.38 11.5 14.5 10.38 14.5 9C14.5 7.62 13.38 6.5 12 6.5Z" fill="currentColor" />
    </IconBase>
);

const ServiceMeshIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M4 8H8V4H4V8ZM10 20H14V16H10V20ZM4 20H8V16H4V20ZM4 14H8V10H4V14ZM10 14H14V10H10V14ZM16 4V8H20V4H16ZM10 8H14V4H10V8ZM16 14H20V10H16V14ZM16 20H20V16H16V20Z" fill="currentColor" />
    </IconBase>
);

const ApiThrottlerIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M11 20H5V10H3V20C3 21.1 3.9 22 5 22H11V20ZM19 10H13V8H19V10ZM19 14H13V12H19V14ZM19 18H13V16H19V18ZM21 4H13C11.9 4 11 4.9 11 6V18C11 19.1 11.9 20 13 20H21C22.1 20 23 19.1 23 18V6C23 4.9 22.1 4 21 4Z" fill="currentColor" />
    </IconBase>
);

const LoadShedderIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M1 21H23L12 2L1 21ZM13 18H11V16H13V18ZM13 14H11V10H13V14Z" fill="currentColor" />
        <path d="M12 16H16L18 10H6L8 16H12Z" fill="white" opacity="0.5" />
    </IconBase>
);

// --- Data Processing Layer ---

const StreamProcessorIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M17 16L22 12L17 8V16ZM7 8L2 12L7 16V8ZM11 8H13V16H11V8Z" fill="currentColor" />
        <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 18H4V6H20V18Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </IconBase>
);

const BatchProcessorIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M19 8H5C3.34 8 2 9.34 2 11V13C2 14.66 3.34 16 5 16H19C20.66 16 22 14.66 22 13V11C22 9.34 20.66 8 19 8ZM19 14H5V13C5 12.45 5.45 12 6 12H18C18.55 12 19 12.45 19 13V14ZM6 4H18C18.55 4 19 3.55 19 3C19 2.45 18.55 2 18 2H6C5.45 2 5 2.45 5 3C5 3.55 5.45 4 6 4ZM6 22H18C18.55 22 19 21.55 19 21C19 20.45 18.55 20 18 20H6C5.45 20 5 20.45 5 21C5 21.55 5.45 22 6 22Z" fill="currentColor" />
    </IconBase>
);

const EtlPipelineIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M12 8V6H8V8H12ZM12 14H8V12H12V14ZM18 10V20H6V10H4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10H18ZM18 4H14.82C14.4 2.84 13.3 2 12 2C10.7 2 9.6 2.84 9.18 4H6C4.9 4 4 4.9 4 6V8H20V6C20 4.9 19.1 4 18 4ZM12 4C12.55 4 13 4.45 13 5H11C11 4.45 11.45 4 12 4Z" fill="currentColor" />
    </IconBase>
);

const ShardingManagerIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <rect x="2" y="2" width="8" height="8" stroke="currentColor" strokeWidth="2" fill="none" />
        <rect x="14" y="2" width="8" height="8" stroke="currentColor" strokeWidth="2" fill="none" />
        <rect x="2" y="14" width="8" height="8" stroke="currentColor" strokeWidth="2" fill="none" />
        <rect x="14" y="14" width="8" height="8" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M6 10V14" stroke="currentColor" strokeWidth="2" />
        <path d="M18 10V14" stroke="currentColor" strokeWidth="2" />
        <path d="M10 6H14" stroke="currentColor" strokeWidth="2" />
        <path d="M10 18H14" stroke="currentColor" strokeWidth="2" />
    </IconBase>
);

const IndexBuilderIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M3 13H5V19H3V13ZM7 7H9V19H7V7ZM11 10H13V19H11V10ZM15 3H17V19H15V3ZM19 12H21V19H19V12ZM5 21H19V23H5V21Z" fill="currentColor" />
        <path d="M12 4V1L8 5L12 9V6C15.31 6 18 8.69 18 12C18 13.01 17.75 13.97 17.3 14.8L18.76 16.26C19.54 15.03 20 13.57 20 12C20 7.58 16.42 4 12 4Z" fill="currentColor" opacity="0.6" />
    </IconBase>
);

// --- Deployment / Infra Ops ---

const CicdPipelineIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM5 19V5H19V19H5ZM7 8H17V10H7V8ZM7 12H17V14H7V12ZM7 16H13V18H7V16Z" fill="currentColor" />
    </IconBase>
);

const CanaryControllerIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M23 12L19 8V11H10L5 6L1 10L6 15L11 10H19V13L23 9L23 12Z" fill="currentColor" />
        <path d="M5 21C2.5 21 1 18.5 1 18.5L2.5 17C2.5 17 3.5 19 5 19C7.5 19 19 19 19 19V21C19 21 7.5 21 5 21Z" fill="currentColor" />
    </IconBase>
);

const FeatureRolloutIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M17 11.5L20 14.5L13.5 21L12 19.5L17 14.5L14 11.5L17 11.5ZM7 11.5L4 14.5L10.5 21L12 19.5L7 14.5L10 11.5L7 11.5ZM5.5 2L18.5 2C19.33 2 20 2.67 20 3.5C20 4.33 19.33 5 18.5 5L15.5 5L17.5 7L15.5 9L12.5 6L14 4.5L18.5 4.5L5.5 4.5L10 9L7 12L4 9L8.5 4.5L5.5 4.5C4.67 4.5 4 3.83 4 3C4 2.17 4.67 1.5 5.5 1.5L5.5 2Z" fill="currentColor" />
    </IconBase>
);

const SecretsManagerIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM9 6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8H9V6ZM18 20H6V10H18V20ZM12 17C13.1 17 14 16.1 14 15C14 13.9 13.1 13 12 13C10.9 13 10 13.9 10 15C10 16.1 10.9 17 12 17Z" fill="currentColor" />
    </IconBase>
);

// --- AI / ML Ops ---

const ModelTrainingIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM6 13H11.5L10 19L18 10H13L15 5L6 13Z" fill="currentColor" />
    </IconBase>
);

const ModelServingIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M18 4H6C4.9 4 4 4.9 4 6V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V6C20 4.9 19.1 4 18 4ZM18 18H6V6H18V18Z" fill="currentColor" opacity="0.2" />
        <path d="M12 8L15 14H9L12 8Z" fill="currentColor" />
        <circle cx="12" cy="16" r="1.5" fill="currentColor" />
    </IconBase>
);

const FeatureStoreIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M4 10V14H20V10H4ZM4 4V8H20V4H4ZM4 20H20V16H4V20Z" fill="currentColor" />
        <path d="M9 6H15" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M9 12H15" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M9 18H15" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </IconBase>
);

const ModelRegistryIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM12 18C10.34 18 9 16.66 9 15C9 13.34 10.34 12 12 12C13.66 12 15 13.34 15 15C15 16.66 13.66 18 12 18ZM15 9H9V7H15V9Z" fill="currentColor" />
    </IconBase>
);

const VectorDbIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" opacity="0.8" />
        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </IconBase>
);

// --- Specialized Storage ---

const TimeSeriesDbIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z" stroke="currentColor" strokeWidth="2" />
        <path d="M12 8V12L14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M18 16L21 22H3L6 16" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    </IconBase>
);

const GraphDbIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <circle cx="6" cy="6" r="3" fill="currentColor" />
        <circle cx="18" cy="6" r="3" fill="currentColor" />
        <circle cx="12" cy="18" r="3" fill="currentColor" />
        <path d="M8.5 7.5L15.5 16.5" stroke="currentColor" strokeWidth="2" />
        <path d="M15.5 7.5L8.5 16.5" stroke="currentColor" strokeWidth="2" />
        <path d="M9 6H15" stroke="currentColor" strokeWidth="2" />
    </IconBase>
);

const DataWarehouseIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M4 10V14H20V10H4ZM4 4V8H20V4H4ZM4 20H20V16H4V20Z" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M12 6V6.01M12 12V12.01M12 18V18.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </IconBase>
);

// --- Infrastructure ---

const DnsIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path d="M3.6 9H20.4" stroke="currentColor" strokeWidth="2" />
        <path d="M3.6 15H20.4" stroke="currentColor" strokeWidth="2" />
        <path d="M11.5 3C11.5 3 14.5 7 14.5 12C14.5 17 11.5 21 11.5 21" stroke="currentColor" strokeWidth="2" />
        <path d="M12.5 3C12.5 3 9.5 7 9.5 12C9.5 17 12.5 21 12.5 21" stroke="currentColor" strokeWidth="2" />
    </IconBase>
);

const FirewallIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M12 2H4V12C4 17.52 7.5 21.5 12 22C16.5 21.5 20 17.52 20 12V2H12ZM14.15 15.65L12 13.5L9.85 15.65L8.44 14.24L10.59 12.09L8.44 9.94L9.85 8.53L12 10.68L14.15 8.53L15.56 9.94L13.41 12.09L15.56 14.24L14.15 15.65Z" fill="currentColor" />
    </IconBase>
);

const ServerlessIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M11.5 22L1 11.5L12.5 2L23 12.5L11.5 22Z" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M12 7V17M7 12H17" stroke="currentColor" strokeWidth="2" />
    </IconBase>
);

const DistributedLockIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M12 17C13.1 17 14 16.1 14 15C14 13.9 13.1 13 12 13C10.9 13 10 13.9 10 15C10 16.1 10.9 17 12 17ZM18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 3C13.66 3 15 4.34 15 6V8H9V6C9 4.34 10.34 3 12 3Z" fill="currentColor" opacity="0.6" />
        <rect x="8" y="11" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2" />
    </IconBase>
);

// --- Annotations & Grouping ---

const BoundingBoxIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" fill="none" opacity="0.8" />
        <path d="M7 3V21M17 3V21M3 7H21M3 17H21" stroke="currentColor" strokeWidth="1" opacity="0.2" />
    </IconBase>
);

const TextNoteIcon = (props) => (
    <IconBase {...props} viewBox="0 0 24 24">
        <path d="M4 4v16h11l5-5V4H4z" fill="currentColor" opacity="0.2" />
        <path d="M4 4v16h11l5-5V4H4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none" />
        <path d="M15 20v-5h5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M8 9h8M8 13h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </IconBase>
);

// --- Mapping ---

export const getIconForType = (type) => {
    switch (type) {
        // Basic
        case COMPONENT_TYPES.CLIENT: return ClientIcon;
        case COMPONENT_TYPES.API_GATEWAY: return ApiGatewayIcon;
        case COMPONENT_TYPES.LOAD_BALANCER: return LoadBalancerIcon;
        case COMPONENT_TYPES.SERVICE: return ServiceIcon;
        case COMPONENT_TYPES.BACKGROUND_WORKER: return BackgroundWorkerIcon;
        case COMPONENT_TYPES.CACHE: return CacheIcon;
        case COMPONENT_TYPES.DATABASE: return DatabaseIcon;
        case COMPONENT_TYPES.MESSAGE_QUEUE: return MessageQueueIcon;
        case COMPONENT_TYPES.OBJECT_STORAGE: return ObjectStorageIcon;
        case COMPONENT_TYPES.SEARCH_INDEX: return SearchIndexIcon;
        case COMPONENT_TYPES.CDN: return CdnIcon;
        case COMPONENT_TYPES.AUTH_SERVICE: return AuthServiceIcon;
        case COMPONENT_TYPES.RATE_LIMITER: return RateLimiterIcon;
        case COMPONENT_TYPES.CONFIG_SERVICE: return ConfigServiceIcon;

        // Reliability
        case COMPONENT_TYPES.CIRCUIT_BREAKER: return CircuitBreakerIcon;
        case COMPONENT_TYPES.RETRY_HANDLER: return RetryHandlerIcon;
        case COMPONENT_TYPES.DEAD_LETTER_QUEUE: return DeadLetterQueueIcon;
        case COMPONENT_TYPES.FAILOVER_ROUTER: return FailoverRouterIcon;
        case COMPONENT_TYPES.REPLICATION_CONTROLLER: return ReplicationControllerIcon;
        case COMPONENT_TYPES.BACKPRESSURE_CONTROLLER: return BackpressureControllerIcon;

        // Observability
        case COMPONENT_TYPES.METRICS_PIPELINE: return MetricsPipelineIcon;
        case COMPONENT_TYPES.LOGGING_PIPELINE: return LoggingPipelineIcon;
        case COMPONENT_TYPES.DISTRIBUTED_TRACING: return DistributedTracingIcon;
        case COMPONENT_TYPES.ALERTING_ENGINE: return AlertingEngineIcon;
        case COMPONENT_TYPES.MONITORING_DASHBOARD: return MonitoringDashboardIcon;

        // Traffic
        case COMPONENT_TYPES.EDGE_ROUTER: return EdgeRouterIcon;
        case COMPONENT_TYPES.GEO_ROUTER: return GeoRouterIcon;
        case COMPONENT_TYPES.SERVICE_MESH: return ServiceMeshIcon;
        case COMPONENT_TYPES.API_THROTTLER: return ApiThrottlerIcon;
        case COMPONENT_TYPES.LOAD_SHEDDER: return LoadShedderIcon;

        // Data Processing
        case COMPONENT_TYPES.STREAM_PROCESSOR: return StreamProcessorIcon;
        case COMPONENT_TYPES.BATCH_PROCESSOR: return BatchProcessorIcon;
        case COMPONENT_TYPES.ETL_PIPELINE: return EtlPipelineIcon;
        case COMPONENT_TYPES.SHARDING_MANAGER: return ShardingManagerIcon;
        case COMPONENT_TYPES.INDEX_BUILDER: return IndexBuilderIcon;

        // Deployment
        case COMPONENT_TYPES.CICD_PIPELINE: return CicdPipelineIcon;
        case COMPONENT_TYPES.CANARY_CONTROLLER: return CanaryControllerIcon;
        case COMPONENT_TYPES.FEATURE_ROLLOUT: return FeatureRolloutIcon;
        case COMPONENT_TYPES.SECRETS_MANAGER: return SecretsManagerIcon;

        // AI / ML
        case COMPONENT_TYPES.MODEL_TRAINING: return ModelTrainingIcon;
        case COMPONENT_TYPES.MODEL_SERVING: return ModelServingIcon;
        case COMPONENT_TYPES.FEATURE_STORE: return FeatureStoreIcon;
        case COMPONENT_TYPES.MODEL_REGISTRY: return ModelRegistryIcon;
        case COMPONENT_TYPES.VECTOR_DB: return VectorDbIcon;

        // Specialized Storage
        case COMPONENT_TYPES.TIME_SERIES_DB: return TimeSeriesDbIcon;
        case COMPONENT_TYPES.GRAPH_DB: return GraphDbIcon;
        case COMPONENT_TYPES.DATA_WAREHOUSE: return DataWarehouseIcon;

        // Infra
        case COMPONENT_TYPES.DNS: return DnsIcon;
        case COMPONENT_TYPES.FIREWALL: return FirewallIcon;
        case COMPONENT_TYPES.SERVERLESS: return ServerlessIcon;
        case COMPONENT_TYPES.DISTRIBUTED_LOCK: return DistributedLockIcon;

        // Annotations
        case COMPONENT_TYPES.BOUNDING_BOX: return BoundingBoxIcon;
        case COMPONENT_TYPES.TEXT_NOTE: return TextNoteIcon;

        default: return ServiceIcon;
    }
};
