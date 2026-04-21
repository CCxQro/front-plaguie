interface CardImageSuperLinkProps {
  imageUrl: string;
  title: string;
  description: string;
  linkText?: string;
  linkHref: string;
  width?: string;
}

export function CardImageSuperLink({
  imageUrl,
  title,
  description,
  linkText = 'Ver más',
  linkHref,
  width = 'w-88',
}: CardImageSuperLinkProps) {
  return (
    <div className={`flex ${width} flex-col items-start gap-5`}>
      {/* Background Image with Overlay */}
      <div className="relative w-full overflow-hidden rounded-xl">
        <img
          src={imageUrl}
          alt={title}
          className="h-2/3 w-full object-cover"
        />
        {/* Overlay + Shadow */}
        <div className="absolute inset-0 rounded-xl bg-white/[0.002] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]" />
      </div>

      {/* Content Container */}
      <div className="flex w-full flex-col items-start gap-2">
        {/* Title */}
        <h4 className="text-lg font-bold leading-7 text-[#0F172A]">
          {title}
        </h4>

        {/* Description */}
        <p className="text-sm font-normal leading-5 text-[#475569]">
          {description}
        </p>

        {/* Link with Arrow */}
        <div className="flex w-full items-start hover:underline">
          <a
            href={linkHref}
            className="text-sm font-semibold leading-5 text-[#75C79E]"
          >
            {linkText}
          </a>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-[#75C79E]"
          >
            <path
              d="M7 10H13M13 10L10 7M13 10L10 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
