/** Avatar exclusif BOP — initiales sur dégradé conique violet/orange */
export function BopAvatar({ size = 40 }: { size?: number }) {
  return (
    <div
      className="relative shrink-0 rounded-full p-[2px]"
      style={{
        width: size,
        height: size,
        background:
          "conic-gradient(from 180deg, #6B2D8E, #9333EA, #F5A623, #6B2D8E)",
      }}
    >
      <div
        className="absolute inset-0 rounded-full opacity-60 blur-md"
        style={{ background: "conic-gradient(from 180deg, #6B2D8E, #F5A623)" }}
        aria-hidden
      />
      <div className="relative grid h-full w-full place-items-center rounded-full bg-[#0b0b1a] text-white">
        <span
          className="font-black tracking-tighter"
          style={{
            fontSize: size * 0.34,
            background: "linear-gradient(135deg, #E9D5FF, #FDBA74)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          BOP
        </span>
      </div>
    </div>
  );
}
