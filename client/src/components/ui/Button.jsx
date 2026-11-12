export default function Button({ variant = 'primary', size, className = '', ...props }) {
  const cls = ['btn', `btn--${variant}`, size && `btn--${size}`, className].filter(Boolean).join(' ')
  return <button className={cls} {...props} />
}
