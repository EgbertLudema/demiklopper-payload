import { FiMapPin } from 'react-icons/fi'
import { getCachedGlobal } from '@/utilities/getGlobals'
import type { Footer as FooterType } from '@/payload-types'
import Link from 'next/link'
import { FaInstagram, FaFacebook, FaLinkedin, FaTwitter, FaTiktok } from 'react-icons/fa6'
import { JSX } from 'react'

export async function Footer() {
  const footerData = (await getCachedGlobal('footer', 1)()) as FooterType

  const { navItems = [], column1, column3, column4 } = footerData
  const col3Items = column3?.text?.split(/\r?\n/) || []
  const year = new Date().getFullYear()

  const iconMap: Record<string, JSX.Element> = {
    instagram: <FaInstagram size={20} />,
    facebook: <FaFacebook size={20} />,
    linkedin: <FaLinkedin size={20} />,
    twitter: <FaTwitter size={20} />,
    tiktok: <FaTiktok size={20} />,
  }

  return (
    <footer className="bg-sky-800 text-white pt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between mb-12">
          {/* Kolom 1 */}
          <div className="mb-8 md:mb-0 w-full md:w-1/2">
            <h3 className="text-2xl font-bold mb-4">{column1?.title}</h3>
            <p className="text-blue-200 max-w-xs">{column1?.text}</p>
          </div>

          {/* Kolom 2 t/m 4 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 w-full md:w-1/2">
            {/* Menu vanuit navItems */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Menu</h4>
              <ul className="space-y-2">
                {navItems.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      href={item.link?.url || '#'}
                      className="text-blue-200 hover:text-white transition-colors"
                    >
                      {item.link?.label || 'Link'}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kolom 3 */}
            <div>
              <h4 className="text-lg font-semibold mb-4">{column3?.titel}</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-blue-200">
                  <FiMapPin size={16} />
                  <span>{column3?.location}</span>
                </li>
                {col3Items.map((item, idx) => (
                  <li key={idx} className="text-blue-200">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Kolom 4 */}
            <div>
              <h4 className="text-lg font-semibold mb-4">{column4?.titel}</h4>
              <ul className="space-y-2">
                <li className="text-blue-200">{column4?.text}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Onderste balk */}
      <div className="container py-6 px-2 border-t border-sky-600 flex flex-col md:flex-row justify-between items-center">
        <div className="text-xs flex flex-col md:flex-row items-center gap-2 mb-4 md:mb-0">
          <p className="text-blue-300">&copy; {year} Demi Klopper. Alle rechten voorbehouden.</p>
          <p className="text-blue-300">
            Gerealiseerd door{' '}
            <a
              href="https://www.el-websolutions.com"
              target="_blank"
              className="underline hover:text-sky-200 transition-colors"
            >
              EL Websolutions
            </a>
          </p>
        </div>
        {footerData.socials?.length > 0 && (
          <div className="flex space-x-4">
            {footerData.socials.map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-white transition-colors"
                aria-label={item.platform}
              >
                {iconMap[item.platform]}
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  )
}
