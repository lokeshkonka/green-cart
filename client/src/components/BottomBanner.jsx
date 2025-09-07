import React from 'react'
import { assets, features } from '../assets/assets'

function BottomBanner() {
  return (
    <div className="relative mt-24">
      {/* Banner images */}
      <img
        src={assets.bottom_banner_image}
        alt="banner"
        className="w-full hidden md:block"
      />
      <img
        src={assets.bottom_banner_image_sm}
        alt="banner"
        className="w-full md:hidden"
      />

      {/* Overlay content */}
      <div className="absolute inset-0 flex flex-col items-center md:items-end md:justify-center pt-16 md:pt-0 md:pr-24">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-primary mb-8">
            Why We Are The Best!!
          </h1>

          {/* Features list */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-4 max-w-xs md:max-w-sm"
              >
                <img
                  src={feature.icon}
                  alt={feature.title}
                  className="w-9 md:w-11 flex-shrink-0"
                />
                <div>
                  <h3 className="text-lg md:text-xl font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500/70 text-xs md:text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BottomBanner
