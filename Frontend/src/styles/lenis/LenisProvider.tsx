import { PropsWithChildren } from "react";
import { useLenis } from "./hooks/uselenis";

const LenisProvider = ({ children }: PropsWithChildren) => {
  useLenis();

  return <>{children}</>;
};

export default LenisProvider;