import styles from "./Button.module.css"

export default function Button ({text, size, callback}: {text: string, size: string, callback: () => void}) {
  const classes = `${styles.button} ${styles[size]}`
  return <div className={classes} onClick={callback}>{text}</div>
}
