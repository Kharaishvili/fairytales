import AsyncStorage from "@react-native-async-storage/async-storage";

export type StorySpec = {
  mainCharacter: string;
  sidekick: string;
  setting: string;
  tone: string;
  length: string;
  age: string;
  moral: string;
};

export type Story = {
  id: string;
  title: string;
  text: string;
  createdAt: number;
  spec: StorySpec;
};

const STORAGE_KEY = "@stories_v1";

async function readAllStories(): Promise<Story[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? (parsed as Story[]) : [];
}

async function writeAllStories(stories: Story[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
}

function makeTitleFromSpec(spec: StorySpec) {
  return `${spec.mainCharacter} & ${spec.sidekick} in the ${spec.setting}`;
}

function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export async function saveStory(args: {
  text: string;
  spec: StorySpec;

  id?: string;
  title?: string;
  createdAt?: number;
  cap?: number;
}): Promise<Story> {
  const {
    text,
    spec,
    id = uid(),
    title = makeTitleFromSpec(spec),
    createdAt = Date.now(),
    cap = 50,
  } = args;

  const stories = await readAllStories();

  const nextStory: Story = { id, title, text, createdAt, spec };

  const existingIndex = stories.findIndex((s) => s.id === id);

  let next: Story[];
  if (existingIndex >= 0) {
    const without = stories.filter((s) => s.id !== id);
    next = [nextStory, ...without];
  } else {
    next = [nextStory, ...stories];
  }

  if (cap > 0 && next.length > cap) {
    next = next.slice(0, cap);
  }

  await writeAllStories(next);
  return nextStory;
}

export async function getStoryById(id: string): Promise<Story | null> {
  const stories = await readAllStories();
  return stories.find((s) => s.id === id) ?? null;
}

export async function deleteStory(id: string): Promise<void> {
  const stories = await readAllStories();
  const next = stories.filter((s) => s.id !== id);
  await writeAllStories(next);
}
