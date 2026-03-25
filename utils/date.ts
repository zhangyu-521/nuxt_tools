export function formatDate(date: Date | string): string {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date)
  return `${formatDate(d)} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export function getToday(): string {
  return formatDate(new Date())
}

export function getMonthFirstDay(month: string): string {
  return `${month}-01`
}

export function getMonthLastDay(month: string): string {
  const [year, monthNum] = month.split('-').map(Number)
  const lastDay = new Date(year, monthNum, 0).getDate()
  return `${month}-${String(lastDay).padStart(2, '0')}`
}

export function getCurrentMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export function getYearMonth(date: string): string {
  return date.slice(0, 7)
}

export function isSameDay(date1: string, date2: string): boolean {
  return date1 === date2
}

export function addDays(date: string, days: number): string {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return formatDate(d)
}

export function getDayOfWeek(date: string): number {
  return new Date(date).getDay()
}

export function getDaysInMonth(month: string): number {
  const [year, monthNum] = month.split('-').map(Number)
  return new Date(year, monthNum, 0).getDate()
}

export function getCalendarDays(month: string): Array<{ date: string; dayOfMonth: number; isCurrentMonth: boolean }> {
  const [year, monthNum] = month.split('-').map(Number)
  const firstDay = new Date(year, monthNum - 1, 1)
  const lastDay = new Date(year, monthNum, 0)
  const daysInMonth = lastDay.getDate()
  const startDayOfWeek = firstDay.getDay()

  const days: Array<{ date: string; dayOfMonth: number; isCurrentMonth: boolean }> = []

  // Previous month days
  const prevMonth = new Date(year, monthNum - 1, 0)
  const prevMonthDays = prevMonth.getDate()
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthDays - i
    const prevMonthStr = String(monthNum - 1 || 12).padStart(2, '0')
    const prevYearStr = monthNum === 1 ? String(year - 1) : String(year)
    days.push({
      date: `${prevYearStr}-${prevMonthStr}-${String(day).padStart(2, '0')}`,
      dayOfMonth: day,
      isCurrentMonth: false,
    })
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: `${month}-${String(i).padStart(2, '0')}`,
      dayOfMonth: i,
      isCurrentMonth: true,
    })
  }

  // Next month days
  const remainingCells = 42 - days.length // 6 rows * 7 days
  const nextMonthStr = String(monthNum + 1 > 12 ? 1 : monthNum + 1).padStart(2, '0')
  const nextYearStr = monthNum === 12 ? String(year + 1) : String(year)
  for (let i = 1; i <= remainingCells; i++) {
    days.push({
      date: `${nextYearStr}-${nextMonthStr}-${String(i).padStart(2, '0')}`,
      dayOfMonth: i,
      isCurrentMonth: false,
    })
  }

  return days
}
