import {
  resizeEventFuns,
  resizeEventFuns_addFuns,
} from "../components/config/config";
import debounce from "./debounce";
import mobileBrowserChecker from "./mobileBrowserChecker";

const rootHeightPropsSetting = (
  queryElementToMeasure: string,
  propName: string
) => {
  const element = document.querySelector(queryElementToMeasure);

  if (element) {
    document.documentElement.style.setProperty(
      propName,
      element.getBoundingClientRect().height + "px"
    );
  } else {
    // throw errorInstanceMaker(
    //   `${queryElementToMeasure} element not found`,
    //   rootHeightPropsSetting.name,
    //   "heightAdjustment.ts"
    // );
  }
};

const mainMobileHeightPropSetting = () => {
  document.documentElement.style.setProperty(
    "--mobile-height",
    window.innerHeight + "px"
  );
};

export const readingAppBarHeight = () => {
  rootHeightPropsSetting("#top-app-bar", "--header-height");
};

document.addEventListener("DOMContentLoaded", () => {
  mobileBrowserChecker(() => {
    mainMobileHeightPropSetting();
  });
});

resizeEventFuns_addFuns(debounce(readingAppBarHeight, 300));

window.addEventListener("resize", (e) => {
  resizeEventFuns.forEach((fun) => {
    fun(e);
  });
});
