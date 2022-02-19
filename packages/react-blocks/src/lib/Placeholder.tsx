import { makeStyles, mergeClasses as cx } from '@fluentui/react-components'

import { rem } from './index'

const useStyles = makeStyles({
  root: (theme) => ({
    boxSizing: 'border-box',
    minHeight: '3rem',
    padding: rem(4),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: theme.colorPaletteRedBorder2,
    borderRadius: rem(6),

    color: theme.colorPaletteRedForeground1,
  }),
})

export const Placeholder = ({
  label,
  className,
}: {
  label: string
  className?: string
}) => {
  const styles = useStyles()
  return <div className={cx(styles.root, className)}>{label}</div>
}