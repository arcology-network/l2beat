import { AssetId } from '@l2beat/shared-pure'
import React, { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react'

import { ProjectSectionId } from '../../../pages/project/components/sections/common/sectionId'
import { cn } from '../../../utils/cn'
import { InfoIcon } from '../../icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../tooltip/Tooltip'

interface Props<
  T extends {
    assetId?: AssetId
    escrows?: object[]
  },
> {
  items: T[]
  columns: ColumnConfig<T>[]
  rows?: RowConfig<T>
}

export interface ColumnConfig<T> {
  name: ReactNode
  shortName?: ReactNode
  align?: 'center' | 'right'
  headClassName?: string
  noPaddingRight?: true
  idHref?: ProjectSectionId
  getValue: (value: T, index: number) => ReactNode
  tooltip?: string
  highlight?: boolean
}

export interface RowConfig<T> {
  getProps: (
    value: T,
    index: number,
  ) => HTMLAttributes<HTMLTableRowElement> &
    Pick<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>
}

export function TVLBreakdownTableView<
  T extends {
    assetId?: AssetId
    escrows?: object[]
  },
>({ items, columns, rows }: Props<T>) {
  const highlightedColumnClassNames =
    'relative after:content-[""] after:absolute after:left-0 after:top-0 after:h-full after:w-full after:-z-1 after:bg-gray-100 after:dark:bg-[#24202C]'

  return (
    <div
      className={cn(
        'overflow-x-auto whitespace-pre text-base',
        '-mx-4 md:-mx-12 w-[calc(100%_+_32px)] px-4 md:w-[calc(100%_+_96px)] md:px-12',
      )}
      data-role="table"
    >
      <table className="w-full border-collapse border-b border-b-black/10 text-left dark:border-b-white/25">
        <thead>
          <tr className="border-b border-b-black/10 dark:border-b-white/25 md:border-b-0 dark:md:bg-white/10 md:bg-black/10">
            {columns.map((column, i) => {
              return (
                <th
                  key={i}
                  className={cn(
                    'w-1/5 whitespace-pre py-2 pr-2 font-medium text-gray-500 text-sm uppercase last:rounded-r first:rounded-l last:md:pr-6 last:pr-2 first:md:pl-6 first:pl-2 dark:text-gray-50',
                    column.headClassName,
                    column.highlight && highlightedColumnClassNames,
                  )}
                >
                  <div
                    className={cn(
                      'flex flex-row items-center gap-1.5',
                      column.align === 'right' && 'justify-end',
                      column.align === 'center' && 'justify-center',
                    )}
                  >
                    <span className={cn(column.shortName && 'hidden md:block')}>
                      {column.name}
                    </span>
                    {column.shortName && (
                      <span className="md:hidden">{column.shortName}</span>
                    )}
                    {column.tooltip && (
                      <Tooltip>
                        <TooltipTrigger className="-translate-y-px md:translate-y-0">
                          <InfoIcon className="fill-current md:size-3.5" />
                        </TooltipTrigger>
                        <TooltipContent>{column.tooltip}</TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            const { className: rowClassName, ...rest } =
              rows?.getProps(item, i) ?? {}

            return (
              <tr
                key={i}
                {...rest}
                className={cn(
                  'group',
                  'border-b border-b-black/10 dark:border-b-zinc-700 md:border-b-0 dark:hover:bg-white/5 hover:bg-black/5 hover:shadow-sm',
                  rowClassName,
                )}
                data-role={
                  item.escrows?.length && item.escrows.length > 1
                    ? 'multiple-escrows-row'
                    : undefined
                }
                data-token={item.assetId}
              >
                {columns.map((column, j) => {
                  return (
                    <td
                      key={j}
                      className={cn(
                        'h-9 py-2 pr-2 md:h-10 last:rounded-r first:rounded-l last:md:pr-6 last:pr-2 first:md:pl-6 first:pl-2 md:pl-4',
                        column.highlight && highlightedColumnClassNames,
                        column.align === 'right' && 'text-right',
                        column.align === 'center' && 'text-center',
                      )}
                    >
                      <div
                        className={cn(
                          'flex items-center',
                          column.align === 'right' && 'justify-end',
                          column.align === 'center' && 'justify-center',
                        )}
                      >
                        {column.getValue(item, i)}
                      </div>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
