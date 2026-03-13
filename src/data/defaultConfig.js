export const CHILDREN = [
  { id: 'reid', name: 'Reid', age: 10, color: 'reid', emoji: '🦊' },
  { id: 'bennett', name: 'Bennett', age: 8, color: 'bennett', emoji: '🐸' },
  { id: 'isla', name: 'Isla', age: 5, color: 'isla', emoji: '🦋' },
]

export const defaultConfig = {
  pin: '1234',
  fairRotation: true,
  earningThreshold: 80,
  weekdayMinutes: 15,
  maxWeeklyMinutes: 75,
  children: CHILDREN,
  // Per-child bank settings (overrides global weekdayMinutes/maxWeeklyMinutes)
  childBank: {
    reid: { bankName: 'Nintendo Minutes', unitLabel: 'min', amountPerSession: 15, weeklyCap: 75 },
    bennett: { bankName: 'Nintendo Minutes', unitLabel: 'min', amountPerSession: 15, weeklyCap: 75 },
    isla: { bankName: 'Nintendo Minutes', unitLabel: 'min', amountPerSession: 15, weeklyCap: 75 },
  },
  // Per-child bonus point rules
  childBonus: {
    reid: { weekdayPerfectPoints: 1, weekendQualifyPoints: 1, weekendThreshold: 80 },
    bennett: { weekdayPerfectPoints: 1, weekendQualifyPoints: 1, weekendThreshold: 80 },
    isla: { weekdayPerfectPoints: 1, weekendQualifyPoints: 1, weekendThreshold: 80 },
  },
  questions: {
    reid: {
      weekday: [
        {
          id: 'reid-wd-1',
          text: 'How did the bathroom go after you used it today?',
          type: 'five_point',
          labels: [
            'Did not clean up. I\'ll make it right in the morning.',
            'Left a few things around. I can do the full job tomorrow.',
            'Got most of it but left a couple things out.',
            'Mostly there — almost everything was put away.',
            'Toothbrush on hook, towel on hook, laundry in basket. Perfect.',
          ],
        },
        {
          id: 'reid-wd-2',
          text: 'How did your sleep go last night?',
          type: 'five_point',
          labels: [
            'Really struggled. I\'m going to focus on this tonight.',
            'Not my best night. I know what to do differently.',
            'Okay but not great. I know I can do better tonight.',
            'Pretty good — a couple small things but mostly on track.',
            'In bed on time, fell asleep easily, slept until 6:30.',
          ],
        },
        {
          id: 'reid-wd-3',
          text: 'How did you do with being kind and respectful today?',
          type: 'five_point',
          labels: [
            'Not my best. Tomorrow I\'m going to try much harder.',
            'Had a tough time with this today. I can do better.',
            'Some good and some not so good. I\'ll be more aware tomorrow.',
            'Mostly good — one or two moments I could have handled better.',
            'I was patient and kind, even when it was hard.',
          ],
        },
        {
          id: 'reid-wd-4',
          text: 'How did you do finishing what you started today — chores, tasks, cleanup?',
          type: 'five_point',
          labels: [
            'Left most things unfinished. Tomorrow I\'ll see it through.',
            'Didn\'t finish a few things I started.',
            'Did most of it but left something incomplete.',
            'Almost — just one small thing I didn\'t quite finish.',
            'I finished everything all the way to the end.',
          ],
        },
      ],
      weekend: [
        {
          id: 'reid-we-1',
          text: 'How were you with being flexible and kind to your brother and sister today?',
          type: 'three_emoji',
          labels: [
            'Tough day for me. I\'ll try harder tomorrow.',
            'Pretty good but could\'ve been more flexible.',
            'I was great — I went along with things and was kind.',
          ],
        },
        {
          id: 'reid-we-2',
          text: 'How was your cleanup after yourself today (bathroom, room, dishes)?',
          type: 'yes_not_yet',
        },
      ],
    },
    bennett: {
      weekday: [
        {
          id: 'bennett-wd-1',
          text: 'How did you do keeping your room and bed tidy today?',
          type: 'five_point',
          labels: [
            'Did not tidy up. I\'ll take care of it in the morning.',
            'Room was pretty messy. I\'ll do better tomorrow.',
            'Got some of it done but not all the way.',
            'Mostly tidy — a couple things out of place.',
            'Bed made, room clean, everything in its place.',
          ],
        },
        {
          id: 'bennett-wd-2',
          text: 'How did you do with being kind and respectful today?',
          type: 'five_point',
          labels: [
            'Not my best. Tomorrow I\'m going to try much harder.',
            'Had a tough time today. I can do better.',
            'Some good and some not so good. I\'ll be more aware tomorrow.',
            'Mostly good — one or two moments I could\'ve done better.',
            'I was patient and kind, even when it was hard.',
          ],
        },
        {
          id: 'bennett-wd-3',
          text: 'How did your sleep routine go last night?',
          type: 'five_point',
          labels: [
            'Really struggled. I\'ll focus on this tonight.',
            'Not my best night.',
            'Okay but could have been better.',
            'Pretty good overall.',
            'In bed on time, fell asleep easily, slept until 6:30.',
          ],
        },
      ],
      weekend: [
        {
          id: 'bennett-we-1',
          text: 'How were you with being flexible and kind to your brother and sister today?',
          type: 'three_emoji',
          labels: [
            'Tough day. I\'ll try harder tomorrow.',
            'Mostly good, could\'ve been more flexible a couple times.',
            'Great — I went along with things and was kind.',
          ],
        },
        {
          id: 'bennett-we-2',
          text: 'How was your cleanup after yourself today?',
          type: 'yes_not_yet',
        },
      ],
    },
    isla: {
      weekday: [
        {
          id: 'isla-wd-1',
          text: 'How did you do eating your dinner without complaining tonight?',
          type: 'three_emoji',
          labels: [
            'It was hard for me today.',
            'Mostly good.',
            'I ate it all and was happy!',
          ],
        },
        {
          id: 'isla-wd-2',
          text: 'How did you do playing kindly today?',
          type: 'three_emoji',
          labels: [
            'I had some trouble today.',
            'Pretty good but not perfect.',
            'I was so kind and shared really well!',
          ],
        },
        {
          id: 'isla-wd-3',
          text: 'How did you do listening to mama and papa today?',
          type: 'three_emoji',
          labels: [
            'I had a hard time listening today.',
            'Most of the time.',
            'I listened really well!',
          ],
        },
      ],
      weekend: [
        {
          id: 'isla-we-1',
          text: 'How did you do being kind to your brothers today?',
          type: 'three_emoji',
          labels: [
            'It was a hard day.',
            'Pretty good.',
            'I was so kind and fun to be with!',
          ],
        },
        {
          id: 'isla-we-2',
          text: 'How did you do listening and being flexible today?',
          type: 'three_emoji',
          labels: [
            'I had trouble with that today.',
            'Mostly good.',
            'I went along with everything happily!',
          ],
        },
      ],
    },
  },
  rewards: [
    { id: 1, name: 'Date night with mama or papa (you pick!)', cost: 10, emoji: '🌟' },
    { id: 2, name: '30-min later bedtime', cost: 4, emoji: '🌙' },
    { id: 3, name: '30-min extra outdoor time after dinner', cost: 3, emoji: '🌳' },
    { id: 4, name: 'Pick family movie night', cost: 2, emoji: '🎬' },
    { id: 5, name: 'Special breakfast of your choice', cost: 2, emoji: '🥞' },
    { id: 6, name: 'Extra 15-min Nintendo (this weekend)', cost: 2, emoji: '🎮' },
  ],
}

// Tiered micro-responses: high (top score), mid (middle), low (bottom)
export const MICRO_RESPONSES = {
  high: [
    'Excellent work! 🌟',
    'Perfect! ✨',
    "That's what it's all about! 💪",
    'Amazing job today! 🎉',
    'You crushed it! 🏆',
    'Way to go! 🙌',
  ],
  mid: [
    'Every day is a chance to get better! ✨',
    'Thanks for being honest! 💛',
    "That's real self-awareness! 🌟",
    'Love that you thought about it! 💭',
    "You're growing every day! 🌱",
    'Good effort — keep it up! 💪',
  ],
  low: [
    'Tomorrow is a fresh start! 🌅',
    'Proud of you for being honest. 💛',
    'That takes courage to say! 🦁',
    'Every day is a new chance! ✨',
    "You'll get there — we believe in you! 💪",
    'Honesty is a superpower! 🌟',
  ],
}
