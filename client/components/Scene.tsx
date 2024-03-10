import {LogEntry} from "@lib/utils/GameLogger";

export default function Scene({log}: {log: LogEntry[]}) {
  return (
    <div className={"scene"}>
      {log.map((event, index) => {
        return (
          <div className={"log"} key={index}>
            <span className={event.type}>{event.message}</span>
          </div>
        )
      })}
    </div>
  )
}
