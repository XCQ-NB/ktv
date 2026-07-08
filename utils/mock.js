// 模拟用户数据
const mockUser = {
  id: 1,
  realName: '赵丽',
  stageName: '赵丽',
  avatar: '',
  phone: '13800138000',
  monthlySoundwave: 244168,
  monthlySessions: 47,
  monthlyTaskRemaining: 5832,
  holidayBalance: 0.5,
  yesterdaySoundwave: 9852,
  todaySoundwave: 0,
  monthSoundwave: 20384,
  monthTaskTarget: 250000,
  monthTaskProgress: 8
}

// 昨日排行榜
const mockRanking = [
  { rank: 1, name: '李淑娴', soundwave: 13849, avatar: '' },
  { rank: 2, name: '赵丽', soundwave: 9852, avatar: '' },
  { rank: 3, name: '宋浩琳', soundwave: 9668, avatar: '' },
  { rank: 4, name: '娄英健', soundwave: 7715, avatar: '' },
  { rank: 5, name: '王晓明', soundwave: 6520, avatar: '' },
  { rank: 6, name: '张小雨', soundwave: 5890, avatar: '' },
  { rank: 7, name: '刘思琪', soundwave: 4560, avatar: '' },
  { rank: 8, name: '陈美丽', soundwave: 3890, avatar: '' },
  { rank: 9, name: '周杰', soundwave: 3200, avatar: '' },
  { rank: 10, name: '吴凡', soundwave: 2800, avatar: '' }
]

// 今日优秀主播
const mockTopStreamers = [
  { rank: 1, name: '李淑娴', soundwave: 5417, avatar: '' },
  { rank: 2, name: '宋浩琳', soundwave: 4200, avatar: '' },
  { rank: 3, name: '娄英健', soundwave: 3417, avatar: '' }
]

// 日常通道
const dailyChannels = [
  { id: 'checkin', name: '音浪打卡', icon: '/assets/icons/3d/note.png' },
  { id: 'schedule', name: '直播间排班', icon: '/assets/icons/3d/screen.png' },
  { id: 'leave', name: '请假', icon: '/assets/icons/3d/clipboard.png' },
  { id: 'task', name: '本月任务', icon: '/assets/icons/3d/task.png' }
]

// 功能介绍
const features = [
  { name: '音浪打卡', icon: '/assets/icons/3d/note.png' },
  { name: '排班管理', icon: '/assets/icons/3d/calendar.png' },
  { name: '请假审批', icon: '/assets/icons/3d/clipboard.png' },
  { name: '数据看板', icon: '/assets/icons/3d/chart.png' }
]

// 我的页面菜单
const profileMenus = [
  { id: 'overview', name: '数据总览', icon: '/assets/icons/3d/bars.png', url: '/pages/dashboard/dashboard' },
  { id: 'leave', name: '请假', icon: '/assets/icons/3d/clipboard.png', url: '/pages/leave/leave' },
  { id: 'task', name: '音浪任务', icon: '/assets/icons/3d/task.png', url: '/pages/task/task' },
  { id: 'notice', name: '公告通知', icon: '/assets/icons/3d/bell.png', url: '/pages/notice/notice' }
]

function formatNumber(num) {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function getRankBadgeClass(rank) {
  if (rank === 1) return 'gold'
  if (rank === 2) return 'silver'
  if (rank === 3) return 'bronze'
  return 'normal'
}

function getInitial(name) {
  return name ? name.charAt(0) : '?'
}

module.exports = {
  mockUser,
  mockRanking,
  mockTopStreamers,
  dailyChannels,
  features,
  profileMenus,
  formatNumber,
  getRankBadgeClass,
  getInitial
}
