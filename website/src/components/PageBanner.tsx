interface PageBannerProps {
  image: string;
  title: string;
  subtitle?: string;
}

const PageBanner = ({ image, title, subtitle }: PageBannerProps) => (
  <section className="relative h-[220px] w-full overflow-hidden lg:h-[300px]">
    <img
      src={image}
      alt={title}
      width={1920}
      height={640}
      className="absolute inset-0 h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-[hsl(243_45%_14%)]/90 via-[hsl(243_45%_14%)]/60 to-transparent" />
    <div className="relative z-10 mx-auto flex h-full max-w-[1280px] flex-col justify-center px-6">
      <h1 className="font-serif text-3xl font-bold text-primary-foreground lg:text-5xl">{title}</h1>
      {subtitle && (
        <p className="mt-3 max-w-xl text-sm text-primary-foreground/80 lg:text-base">{subtitle}</p>
      )}
    </div>
  </section>
);

export default PageBanner;
