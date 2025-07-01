import React from 'react';



const PlantIcon = () => (
  <svg
    className="w-12 h-12 text-gray-700" 
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Saksı */}
    <path d="M7 15.5h10v4.5a1 1 0 0 1 -1 1h-8a1 1 0 0 1 -1 -1v-4.5z" />
    {/* Gövde */}
    <path d="M12 15.5V10" />
    {/* Sol Yaprak */}
    <path d="M12 10C10.5 10 9 8.5 9 6.5C9 4.5 10.5 3 12 3" />
    {/* Sağ Yaprak */}
    <path d="M12 10C13.5 10 15 8.5 15 6.5C15 4.5 13.5 3 12 3" />
  </svg>
);

const BoxIcon = () => (
  <svg
    className="w-12 h-12 text-gray-700"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3l8 4.5v9l-8 4.5l-8-4.5v-9l8-4.5" />
    <path d="M12 12l8-4.5" />
    <path d="M12 12v9" />
    <path d="M12 12L4 7.5" />
    <path d="M16 5.25l-8 4.5" /> {/* Üst kapak çizgisi */}
  </svg>
);

const SupportIcon = () => (
  <svg
    className="w-12 h-12 text-gray-700"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    <path d="M15 3h6v6" />
    <path d="M15 9l6-6" />
  </svg>
);

const featuresData = [
  {
    id: 1,
    icon: <PlantIcon />,
    title: "Geniş Ürün Çeşitliliği",
    description: "Her kategoride daha az çeşitlilikle, birçok farklı ürün çeşidi sunuyoruz.",
  },
  {
    id: 2,
    icon: <BoxIcon />,
    title: "Hızlı ve Ücretsiz Kargo",
    description: "4 gün veya daha kısa sürede teslimat, ücretsiz kargo ve hızlandırılmış teslimat seçeneği.",
  },
  {
    id: 3,
    icon: <SupportIcon />,
    title: "7/24 Destek",
    description: "İşletmenizle ilgili her türlü sorunuza 7/24 ve gerçek zamanlı yanıtlar.",
  },
];

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-24 h-24 bg-[#DDEBF7] rounded-full flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-base text-gray-600 max-w-[280px] sm:max-w-xs">{description}</p>
    </div>
  );
};

const AboutUsSection = () => {
  return (
    <section className="bg-white py-16 sm:py-20 px-4">
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-4xl font-bold text-gray-800 mb-3">Hakkımızda</h2>
        <p className="text-lg text-gray-500">Şimdi sipariş verin ve teknolojiyle buluşun</p>
      </div>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12 md:gap-y-0 md:gap-x-12">
        {featuresData.map((feature) => (
          <FeatureCard
            key={feature.id}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
};

export default AboutUsSection;