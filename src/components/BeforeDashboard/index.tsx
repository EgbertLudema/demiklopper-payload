import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import { SeedButton } from './SeedButton'
import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Welkom in je dashboard Demi 😀</h4>
      </Banner>
      <p>
        Hier kun je de inhoud van je website beheren. Je kunt bijvoorbeeld nieuwe pagina's of
        portfolio items toevoegen, bestaande pagina's of portfolio items bewerken of verwijderen, en
        de instellingen van je website aanpassen.
      </p>
    </div>
  )
}

export default BeforeDashboard
