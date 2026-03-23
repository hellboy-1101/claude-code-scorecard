"use client";

interface AvatarProps {
  type: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_MAP = {
  sm: 64,
  md: 120,
  lg: 200,
};

function ClaudeBase({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <g>
      {/* Claude body - rounded shape */}
      <ellipse cx="50" cy="55" rx="28" ry="30" fill={color} opacity="0.15" />
      <ellipse cx="50" cy="55" rx="25" ry="27" fill={color} opacity="0.3" />
      <ellipse cx="50" cy="52" rx="20" ry="22" fill={color} />
      {/* Face */}
      <circle cx="43" cy="48" r="2.5" fill="white" />
      <circle cx="57" cy="48" r="2.5" fill="white" />
      <path d="M 44 56 Q 50 62 56 56" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
      {/* Type-specific accessory */}
      {children}
    </g>
  );
}

function ExplorerAvatar() {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ClaudeBase color="#3B82F6">
        {/* Magnifying glass */}
        <circle cx="70" cy="30" r="10" fill="none" stroke="#3B82F6" strokeWidth="3" />
        <line x1="77" y1="37" x2="84" y2="44" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
        <circle cx="70" cy="30" r="6" fill="#DBEAFE" opacity="0.5" />
        {/* Sparkles */}
        <circle cx="25" cy="25" r="2" fill="#3B82F6" opacity="0.6" />
        <circle cx="30" cy="18" r="1.5" fill="#3B82F6" opacity="0.4" />
      </ClaudeBase>
    </svg>
  );
}

function ArchitectAvatar() {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ClaudeBase color="#8B5CF6">
        {/* Blueprint / document */}
        <rect x="62" y="20" width="22" height="28" rx="2" fill="#EDE9FE" stroke="#8B5CF6" strokeWidth="1.5" />
        <line x1="66" y1="27" x2="80" y2="27" stroke="#8B5CF6" strokeWidth="1" opacity="0.6" />
        <line x1="66" y1="32" x2="78" y2="32" stroke="#8B5CF6" strokeWidth="1" opacity="0.6" />
        <line x1="66" y1="37" x2="76" y2="37" stroke="#8B5CF6" strokeWidth="1" opacity="0.6" />
        <line x1="66" y1="42" x2="74" y2="42" stroke="#8B5CF6" strokeWidth="1" opacity="0.6" />
        {/* Pencil */}
        <line x1="20" y1="35" x2="30" y2="25" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" />
        <polygon points="19,37 21,34 18,38" fill="#8B5CF6" />
      </ClaudeBase>
    </svg>
  );
}

function EngineerAvatar() {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ClaudeBase color="#F59E0B">
        {/* Gear */}
        <g transform="translate(72, 28)">
          <circle cx="0" cy="0" r="8" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
          <circle cx="0" cy="0" r="4" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
          {/* Gear teeth */}
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <rect
              key={angle}
              x="-2"
              y="-11"
              width="4"
              height="4"
              rx="0.5"
              fill="#F59E0B"
              transform={`rotate(${angle})`}
            />
          ))}
        </g>
        {/* Wrench */}
        <g transform="translate(22, 30) rotate(-30)">
          <rect x="-1.5" y="-12" width="3" height="16" rx="1" fill="#F59E0B" />
          <circle cx="0" cy="-12" r="4" fill="none" stroke="#F59E0B" strokeWidth="2" />
        </g>
      </ClaudeBase>
    </svg>
  );
}

function CommanderAvatar() {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ClaudeBase color="#EF4444">
        {/* Mini Claudes being directed */}
        <ellipse cx="18" cy="22" rx="7" ry="8" fill="#EF4444" opacity="0.5" />
        <circle cx="16" cy="20" r="1" fill="white" />
        <circle cx="20" cy="20" r="1" fill="white" />

        <ellipse cx="82" cy="22" rx="7" ry="8" fill="#EF4444" opacity="0.5" />
        <circle cx="80" cy="20" r="1" fill="white" />
        <circle cx="84" cy="20" r="1" fill="white" />

        <ellipse cx="50" cy="15" rx="7" ry="8" fill="#EF4444" opacity="0.5" />
        <circle cx="48" cy="13" r="1" fill="white" />
        <circle cx="52" cy="13" r="1" fill="white" />

        {/* Connection lines */}
        <line x1="25" y1="25" x2="40" y2="40" stroke="#EF4444" strokeWidth="1" opacity="0.3" strokeDasharray="2 2" />
        <line x1="75" y1="25" x2="60" y2="40" stroke="#EF4444" strokeWidth="1" opacity="0.3" strokeDasharray="2 2" />
        <line x1="50" y1="23" x2="50" y2="35" stroke="#EF4444" strokeWidth="1" opacity="0.3" strokeDasharray="2 2" />
      </ClaudeBase>
    </svg>
  );
}

function ScholarAvatar() {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ClaudeBase color="#10B981">
        {/* Paper/Document */}
        <rect x="64" y="18" width="18" height="24" rx="2" fill="#D1FAE5" stroke="#10B981" strokeWidth="1.5" />
        <line x1="67" y1="24" x2="79" y2="24" stroke="#10B981" strokeWidth="0.8" opacity="0.5" />
        <line x1="67" y1="28" x2="78" y2="28" stroke="#10B981" strokeWidth="0.8" opacity="0.5" />
        <line x1="67" y1="32" x2="76" y2="32" stroke="#10B981" strokeWidth="0.8" opacity="0.5" />
        <line x1="67" y1="36" x2="77" y2="36" stroke="#10B981" strokeWidth="0.8" opacity="0.5" />
        {/* Magnifying glass (smaller) */}
        <circle cx="24" cy="26" r="7" fill="none" stroke="#10B981" strokeWidth="2" />
        <line x1="29" y1="31" x2="34" y2="36" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
        <circle cx="24" cy="26" r="4" fill="#D1FAE5" opacity="0.4" />
      </ClaudeBase>
    </svg>
  );
}

function VisionaryAvatar() {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ClaudeBase color="#EC4899">
        {/* Telescope */}
        <g transform="translate(70, 25) rotate(30)">
          <rect x="-3" y="-18" width="6" height="22" rx="2" fill="#EC4899" />
          <ellipse cx="0" cy="-18" rx="5" ry="3" fill="#FCE7F3" stroke="#EC4899" strokeWidth="1" />
          <rect x="-1.5" y="4" width="3" height="6" rx="1" fill="#EC4899" opacity="0.7" />
        </g>
        {/* Stars */}
        <circle cx="22" cy="18" r="2" fill="#EC4899" opacity="0.7" />
        <circle cx="30" cy="12" r="1.5" fill="#EC4899" opacity="0.5" />
        <circle cx="18" cy="28" r="1" fill="#EC4899" opacity="0.4" />
        {/* Sparkle effect */}
        <path d="M 26 22 L 27 19 L 28 22 L 31 23 L 28 24 L 27 27 L 26 24 L 23 23 Z" fill="#EC4899" opacity="0.3" />
      </ClaudeBase>
    </svg>
  );
}

const AVATAR_MAP: Record<string, () => React.ReactElement> = {
  explorer: ExplorerAvatar,
  architect: ArchitectAvatar,
  engineer: EngineerAvatar,
  commander: CommanderAvatar,
  scholar: ScholarAvatar,
  visionary: VisionaryAvatar,
};

export default function Avatar({ type, size = "md", className = "" }: AvatarProps) {
  const AvatarComponent = AVATAR_MAP[type];
  if (!AvatarComponent) return null;

  const px = SIZE_MAP[size];
  return (
    <div className={className} style={{ width: px, height: px }}>
      <AvatarComponent />
    </div>
  );
}
