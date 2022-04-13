import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EventNoteIcon from "@mui/icons-material/EventNote";
import StorageIcon from "@mui/icons-material/Storage";

export const config = {
  links: [
    {
      link: "trainings",
      text: "Trainings",
      authRequired: false,
      icon: StorageIcon,
    },
    {
      link: "progress",
      text: "Progress",
      authRequired: false,
      icon: TrendingUpIcon,
    },
    {
      link: "plan",
      text: "Plan",
      authRequired: false,
      icon: EventNoteIcon,
    },
  ],
};

export let resizeEventFuns: Array<(e: Event) => void> = [];

export const resizeEventFuns_deleteFuns = (
  ...funsToDelete: Array<(e: Event) => void>
): void => {
  resizeEventFuns = resizeEventFuns.filter((fun) => {
    for (const funToDelete of funsToDelete) {
      if (fun === funToDelete) {
        return false;
      }
    }
    return true;
  });
};

export const resizeEventFuns_addFuns = (
  ...funToAdd: Array<(e: Event) => void>
): void => {
  resizeEventFuns = resizeEventFuns.concat(funToAdd);
};
