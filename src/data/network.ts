export const COLLEGES = [
  "Smith College",
  "Amherst College",
  "UMass Amherst",
  "Mount Holyoke College",
  "Hampshire College",
  "Williams College",
  "MIT",
  "Harvard University",
] as const;

export type College = (typeof COLLEGES)[number];

export const INTERESTS = [
  "Entrepreneurship",
  "Technology",
  "Finance",
  "Hiking",
  "Food",
  "Art",
  "Music",
  "Film",
  "Public policy",
  "Sustainability",
  "Research",
  "Dance",
  "Languages",
  "Sports",
] as const;

export type Interest = (typeof INTERESTS)[number];

export const CONNECTION_GOALS = [
  "Meet students at other colleges",
  "Weekend plans",
  "Academic or career peers",
  "Cultural exchange",
  "New to the area",
] as const;

export type ConnectionGoal = (typeof CONNECTION_GOALS)[number];

export const AVAILABILITY = [
  "Weekday afternoon",
  "Weekday evening",
  "Saturday morning",
  "Saturday afternoon",
  "Saturday evening",
  "Sunday afternoon",
  "Sunday evening",
] as const;

export type Availability = (typeof AVAILABILITY)[number];

export const MEET_PREFERENCES = ["Virtual first", "In person", "Either"] as const;
export type MeetPreference = (typeof MEET_PREFERENCES)[number];

export interface MyNetworkProfile {
  firstName: string;
  college: College;
  interests: Interest[];
  goals: ConnectionGoal[];
  availability: Availability[];
  meetPreference: MeetPreference;
}

export interface NetworkStudent {
  id: string;
  public: {
    firstName: string;
    college: College;
    year: string;
    interests: Interest[];
    introLine: string;
    meetPreference: MeetPreference;
  };
  private: {
    availability: Availability[];
    goals: ConnectionGoal[];
    context?: string;
  };
}

const student = (
  id: string,
  firstName: string,
  college: College,
  year: string,
  interests: Interest[],
  introLine: string,
  meetPreference: MeetPreference,
  availability: Availability[],
  goals: ConnectionGoal[],
  context?: string,
): NetworkStudent => ({
  id,
  public: {
    firstName,
    college,
    year,
    interests,
    introLine,
    meetPreference,
  },
  private: {
    availability,
    goals,
    ...(context ? { context } : {}),
  },
});

export const NETWORK_STUDENTS: NetworkStudent[] = [
  student(
    "a1",
    "Ana",
    "Amherst College",
    "Class of 2028",
    ["Entrepreneurship", "Hiking", "Food"],
    "Works on a student venture and likes finding reasons to get off campus.",
    "Either",
    ["Saturday afternoon", "Sunday afternoon"],
    ["Meet students at other colleges", "Weekend plans"],
  ),
  student(
    "a2",
    "Ravi",
    "UMass Amherst",
    "Class of 2029",
    ["Technology", "Finance", "Sports"],
    "Interested in fintech, pickup sports, and meeting people outside UMass.",
    "Virtual first",
    ["Weekday evening", "Sunday evening"],
    ["Academic or career peers", "Meet students at other colleges"],
  ),
  student(
    "a3",
    "Minji",
    "Mount Holyoke College",
    "Class of 2028",
    ["Research", "Food", "Languages"],
    "Likes low-key dinners, language exchange, and research conversations.",
    "Either",
    ["Saturday evening", "Sunday afternoon"],
    ["Cultural exchange", "Meet students at other colleges"],
  ),
  student(
    "a4",
    "Tomas",
    "Hampshire College",
    "Class of 2027",
    ["Entrepreneurship", "Sustainability", "Art"],
    "Builds small climate projects and is always up for a campus event.",
    "In person",
    ["Weekday afternoon", "Saturday afternoon"],
    ["Academic or career peers", "Weekend plans"],
  ),
  student(
    "a5",
    "Leila",
    "Williams College",
    "Class of 2028",
    ["Finance", "Art", "Food"],
    "Wants more connections beyond Williams and likes museum and cafe trips.",
    "Virtual first",
    ["Weekday evening", "Sunday afternoon"],
    ["Meet students at other colleges", "Weekend plans"],
  ),
  student(
    "a6",
    "Kenji",
    "Amherst College",
    "Class of 2029",
    ["Technology", "Hiking", "Film"],
    "Likes building things, hiking, and film nights with small groups.",
    "Either",
    ["Saturday afternoon", "Saturday evening"],
    ["Weekend plans", "New to the area"],
  ),
  student(
    "a7",
    "Nour",
    "UMass Amherst",
    "Class of 2028",
    ["Entrepreneurship", "Public policy", "Food"],
    "Interested in startups with a public-interest angle and community events.",
    "Either",
    ["Weekday evening", "Saturday afternoon"],
    ["Academic or career peers", "Meet students at other colleges"],
  ),
  student(
    "a8",
    "Elena",
    "Mount Holyoke College",
    "Class of 2029",
    ["Art", "Film", "Languages"],
    "Enjoys exhibitions, films, and meeting people through shared activities.",
    "In person",
    ["Saturday afternoon", "Sunday afternoon"],
    ["Cultural exchange", "Weekend plans"],
  ),
  student(
    "a9",
    "Daniel",
    "Hampshire College",
    "Class of 2027",
    ["Music", "Technology", "Entrepreneurship"],
    "Makes music, prototypes apps, and likes informal project nights.",
    "Virtual first",
    ["Weekday evening", "Sunday evening"],
    ["Academic or career peers", "Meet students at other colleges"],
  ),
  student(
    "a10",
    "Priya",
    "Amherst College",
    "Class of 2027",
    ["Finance", "Entrepreneurship", "Sustainability"],
    "Interested in investing, climate, and meeting other builders in the Valley.",
    "Either",
    ["Weekday afternoon", "Saturday afternoon"],
    ["Academic or career peers", "Meet students at other colleges"],
  ),
  student(
    "a11",
    "Mateo",
    "UMass Amherst",
    "Class of 2029",
    ["Food", "Dance", "Sports"],
    "New to the area and looking for things to do off campus on weekends.",
    "In person",
    ["Saturday evening", "Sunday afternoon"],
    ["New to the area", "Weekend plans"],
  ),
  student(
    "a12",
    "Aisha",
    "Mount Holyoke College",
    "Class of 2028",
    ["Entrepreneurship", "Technology", "Public policy"],
    "Interested in civic tech and meeting students building projects elsewhere.",
    "Virtual first",
    ["Weekday evening", "Sunday afternoon"],
    ["Academic or career peers", "Meet students at other colleges"],
  ),
  student(
    "a13",
    "Hoang",
    "Williams College",
    "Class of 2027",
    ["Technology", "Finance", "Hiking"],
    "Likes markets, coding, and day trips when the workload allows.",
    "Virtual first",
    ["Saturday afternoon", "Sunday evening"],
    ["Academic or career peers", "Weekend plans"],
  ),
  student(
    "a14",
    "Camille",
    "MIT",
    "Class of 2028",
    ["Technology", "Research", "Entrepreneurship"],
    "Works on technical projects and likes meeting students building outside MIT.",
    "Virtual first",
    ["Weekday evening", "Sunday evening"],
    ["Academic or career peers", "Meet students at other colleges"],
  ),
  student(
    "a15",
    "Omar",
    "Harvard University",
    "Class of 2028",
    ["Public policy", "Finance", "Languages"],
    "Interested in international affairs, finance, and cross-campus conversations.",
    "Virtual first",
    ["Weekday evening", "Sunday afternoon"],
    ["Cultural exchange", "Academic or career peers"],
  ),
  student(
    "a16",
    "Hana",
    "Hampshire College",
    "Class of 2029",
    ["Art", "Food", "Sustainability"],
    "New to Western Massachusetts and looking for casual weekend plans.",
    "Either",
    ["Saturday afternoon", "Sunday afternoon"],
    ["New to the area", "Weekend plans"],
  ),
];

export const BOARD_CATEGORIES = [
  "Housing",
  "Rides",
  "Travel",
  "Campus visit",
  "Buy / sell / give",
  "Other",
] as const;

export type BoardCategory = (typeof BOARD_CATEGORIES)[number];

export interface BoardPost {
  id: string;
  category: BoardCategory;
  title: string;
  body: string;
  authorFirstName: string;
  college: College;
  location: string;
  postedWhen: string;
}

export const BOARD_POSTS: BoardPost[] = [
  {
    id: "p1",
    category: "Housing",
    title: "Looking for a summer sublet near Smith",
    body: "May 22 through August 15. Furnished preferred. Budget up to $950/month and open to sharing with one roommate.",
    authorFirstName: "Minji",
    college: "Mount Holyoke College",
    location: "Northampton",
    postedWhen: "18 min ago",
  },
  {
    id: "p2",
    category: "Housing",
    title: "Room available for January term",
    body: "One furnished room in a three-bedroom apartment. Short-term stay is okay. Five-minute walk to downtown.",
    authorFirstName: "Ana",
    college: "Amherst College",
    location: "Northampton",
    postedWhen: "1 hr ago",
  },
  {
    id: "p3",
    category: "Rides",
    title: "Northampton to Boston on Friday",
    body: "Leaving around 4:30 PM and have two seats. Happy to drop near Back Bay or Cambridge.",
    authorFirstName: "Ravi",
    college: "UMass Amherst",
    location: "Northampton → Boston",
    postedWhen: "2 hrs ago",
  },
  {
    id: "p4",
    category: "Campus visit",
    title: "At Amherst this Saturday",
    body: "Visiting for a student event and would love to grab lunch with other international students nearby.",
    authorFirstName: "Leila",
    college: "Williams College",
    location: "Amherst",
    postedWhen: "Today",
  },
  {
    id: "p5",
    category: "Travel",
    title: "Anyone heading to NYC October 3?",
    body: "Thinking of taking the morning train down and returning Sunday evening. Looking for travel buddies.",
    authorFirstName: "Hana",
    college: "Hampshire College",
    location: "Western MA → NYC",
    postedWhen: "Yesterday",
  },
  {
    id: "p6",
    category: "Buy / sell / give",
    title: "Desk lamp and kitchen basics to give away",
    body: "Moving rooms this weekend. Everything is free if someone can pick it up.",
    authorFirstName: "Tomas",
    college: "Hampshire College",
    location: "Amherst",
    postedWhen: "Yesterday",
  },
];

export interface ConversationMessage {
  id: string;
  sender: string;
  college: College;
  text: string;
  time: string;
}

export interface Conversation {
  id: string;
  title: string;
  description: string;
  participantCount: number;
  collegeCount: number;
  lastUpdated: string;
  messages: ConversationMessage[];
}

export const CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    title: "Building things on campus",
    description:
      "A small conversation for international students working on startups, clubs, or side projects.",
    participantCount: 4,
    collegeCount: 4,
    lastUpdated: "12 min",
    messages: [
      {
        id: "m1",
        sender: "Ana",
        college: "Amherst College",
        text: "Has anyone found a good way to recruit early users across campuses without spamming group chats?",
        time: "8:41 PM",
      },
      {
        id: "m2",
        sender: "Ravi",
        college: "UMass Amherst",
        text: "We had better luck asking one club at each campus to share a short signup form.",
        time: "8:46 PM",
      },
      {
        id: "m3",
        sender: "You",
        college: "Smith College",
        text: "That is close to what I am testing too. I care a lot about keeping the network useful instead of noisy.",
        time: "8:50 PM",
      },
    ],
  },
  {
    id: "c2",
    title: "Weekend plans around the Valley",
    description:
      "Low-key plans for people who want to get off campus without joining a huge group.",
    participantCount: 3,
    collegeCount: 3,
    lastUpdated: "1 hr",
    messages: [
      {
        id: "m4",
        sender: "Hana",
        college: "Hampshire College",
        text: "I was thinking about the farmers market Saturday morning. Anyone else around?",
        time: "6:22 PM",
      },
      {
        id: "m5",
        sender: "Minji",
        college: "Mount Holyoke College",
        text: "I could do late morning if we keep it simple.",
        time: "6:39 PM",
      },
    ],
  },
  {
    id: "c3",
    title: "Boston summer internships",
    description:
      "Housing, commuting, and practical advice for students spending the summer in Boston.",
    participantCount: 5,
    collegeCount: 4,
    lastUpdated: "Yesterday",
    messages: [
      {
        id: "m6",
        sender: "Leila",
        college: "Williams College",
        text: "For people still looking, I found a few university sublet boards that seem more reliable than Marketplace.",
        time: "Yesterday",
      },
    ],
  },
];
