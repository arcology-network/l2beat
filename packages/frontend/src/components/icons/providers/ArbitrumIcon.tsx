import cx from 'classnames'
import React, { SVGAttributes } from 'react'

import { Icon } from '../Icon'

export function ArbitrumIcon(props: SVGAttributes<SVGElement>) {
  return (
    <Icon aria-label="arbitrum logo" className={cx(props.className)} {...props}>
      <path
        transform="matrix(1.5 0 0 1.5 -.15061 0)"
        d="m8.1228 0.99197c0.0389 0 0.07586 0.009726 0.11087 0.029176l5.8663 3.4136c0.0681 0.03891 0.1089 0.11282 0.1089 0.19062l-0.0214 6.7863c0 0.0778-0.0428 0.1517-0.1108 0.1906l-5.8896 3.3747c-0.03307 0.0194-0.07197 0.0291-0.11087 0.0291s-0.07586-0.0097-0.11087-0.0291l-5.8643-3.4136c-0.06808-0.0389-0.10892-0.1128-0.10892-0.1906l0.02139-6.7863c0-0.0778 0.04279-0.15172 0.11087-0.19062l5.8896-3.3746c0.03306-0.01945 0.07002-0.029176 0.10892-0.029176zm0.00389-0.99197c-0.21006 0-0.41818 0.052516-0.60685 0.15949l-5.8896 3.3747c-0.3754 0.2159-0.6088 0.61463-0.6088 1.0484l-0.0214 6.7863c-0.001943 0.4337 0.22757 0.8344 0.60297 1.0523l5.8663 3.4135c0.18672 0.1089 0.39679 0.1634 0.60491 0.1654 0.20812 0.0019 0.41818-0.0526 0.60685-0.1595l5.8896-3.3747c0.3754-0.2159 0.6088-0.6146 0.6088-1.0484l0.0214-6.7862c0.0019-0.43374-0.2276-0.83442-0.603-1.0523l-5.8662-3.4136c-0.18672-0.10892-0.39484-0.16533-0.60491-0.16533z"
        clipPath="url(#clipPath4)"
        className="fill-[#1b4add] dark:fill-current"
      />
      <path
        transform="matrix(1.5 0 0 1.5 -.15057 0)"
        d="m9.3151 3.6995h-0.85971c-0.06419 0-0.12254 0.04085-0.14394 0.10115l-2.7658 7.5799c-0.01751 0.0505 0.01945 0.103 0.07196 0.103h0.85971c0.06419 0 0.12254-0.0408 0.14394-0.1011l2.7658-7.5798c0.01751-0.05057-0.01945-0.10309-0.07196-0.10309zm-1.5035 0h-0.85971c-0.06419 0-0.12254 0.04085-0.14394 0.10115l-2.7658 7.5799c-0.01751 0.0505 0.01945 0.103 0.07196 0.103h0.85971c0.06419 0 0.12254-0.0408 0.14394-0.1011l2.7658-7.5798c0.01751-0.05057-0.01945-0.10309-0.07196-0.10309zm1.1126 2.939c-0.02528-0.06808-0.12059-0.06808-0.14393 0l-0.44736 1.2254c-0.01167 0.03306-0.01167 0.07196 0 0.10503l1.2448 3.4136c0.02139 0.0603 0.07974 0.1011 0.14393 0.1011h0.85971c0.0525 0 0.0895-0.0525 0.072-0.103zm3.2346 4.7421-2.4818-6.8019c-0.02528-0.06807-0.12059-0.06807-0.14393 0l-0.44736 1.2254c-0.01167 0.03307-0.01167 0.07197 0 0.10504l1.9975 5.4753c0.0214 0.0603 0.0798 0.1012 0.144 0.1012h0.8597c0.0525-2e-3 0.0894-0.0545 0.0719-0.105z"
        clipPath="url(#clipPath3)"
        className="fill-[#1b4add] dark:fill-current"
      />
      <defs>
        <clipPath id="clipPath3">
          <rect width="16" height="16" fill="#fff" />
        </clipPath>
        <clipPath id="clipPath4">
          <rect width="16" height="16" fill="#fff" />
        </clipPath>
      </defs>
    </Icon>
  )
}