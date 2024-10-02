import { atom, useAtom } from "jotai";

import { Issue, issues } from "@/app/data";

type Config = {
  selected: Issue["id"] | null;
};

const configAtom = atom<Config>({
  selected: issues[0].id,
});

export function useMessage() {
  return useAtom(configAtom);
}
