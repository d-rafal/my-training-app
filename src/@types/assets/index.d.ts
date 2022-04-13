declare module "*.svg" {
  export const ReactComponent: (
    props: React.SVGProps<SVGSVGElement>
  ) => JSX.Element;

  const src: string;
  export default src;
}
