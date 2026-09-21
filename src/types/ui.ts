import type { ButtonHTMLAttributes, ReactNode } from "react";
import type {
  TCapability,
  TCaseStudy,
  TContactPath,
  TExperienceItem,
  TPersonalBuild,
  TSectionId,
  TSkillGroup,
} from "./portfolio";

export type TButtonVariant = "primary" | "secondary" | "ghost";

export type TTelescopeCursorState =
  | "default"
  | "interactive"
  | "inspect"
  | "planet"
  | "text"
  | "native";

export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: TButtonVariant;
  href?: string;
  external?: boolean;
  magnetic?: boolean;
  download?: string | boolean;
  children: ReactNode;
}

export interface IStatusPillProps {
  label: string;
}

export interface IMonogramProps {
  className?: string;
  title?: string;
  decorative?: boolean;
}

export interface IProjectModalProps {
  project: TCaseStudy | null;
  onClose: () => void;
}

export interface IProjectCardProps {
  project: TCaseStudy;
  onOpen: () => void;
  isActive: boolean;
  onActivate: () => void;
}

export interface IModalBlockProps {
  term: string;
  detail: string;
}

export interface IExperienceCopyProps {
  item: TExperienceItem;
  isActive: boolean;
  onActivate: () => void;
}

export interface ICapabilityBlockProps {
  item: TCapability;
  isActive: boolean;
  onActivate: () => void;
}

export interface IContactPathProps {
  path: TContactPath;
  email: string;
}

export interface IEarlierBuildCardProps {
  item: TPersonalBuild;
}

export interface IStackGroupProps {
  group: TSkillGroup;
}

export interface IRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export interface ISectionShellProps {
  id: TSectionId;
  children: ReactNode;
}

export interface IJourneyProviderProps {
  children: ReactNode;
}

export interface IPointerUi {
  clientX: number;
  clientY: number;
  target: EventTarget | null;
}

export interface IPortfolioContextValue {
  activeSection: TSectionId;
  setActiveSection: (id: TSectionId) => void;
  openProjectId: string | null;
  setOpenProjectId: (id: string | null) => void;
  commandOpen: boolean;
  setCommandOpen: (open: boolean) => void;
  activeWorkId: string;
  setActiveWorkId: (id: string) => void;
  activeExperienceId: string;
  setActiveExperienceId: (id: string) => void;
  activeCapabilityId: string;
  setActiveCapabilityId: (id: string) => void;
}
