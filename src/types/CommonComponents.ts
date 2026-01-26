import { InputType } from "reactstrap/types/lib/Input";

export interface ImageProps {
  className?: string;
  src: string;
  alt?: string;
  style?: object;
  height?: number;
  id?: string;
  title?: string;
  width?: number;
}

export interface CommonHeaderType {
  title: string;
  content?: string;
  animation?: boolean;
  headClass?: string;
  titleClass?: string;
  view?: boolean;
  subClass?: string;
  url?: string;
  contentClass?: string;
}

export interface SvgType {
  iconId: string | undefined;
  className?: string;
  style?: {
    height?: number;
    width?: number;
    fill?: string;
    marginRight?: number;
  };
  onClick?: () => void;
}

export interface RatioImageType {
  className?: string;
  src: string;
  alt: string;
  style?: { height: number };
}

export interface BreadcrumbsType {
  title: string;
  subTitle?: string;
  url: string;
  mainClass?: string;
  image?:boolean;
}

export interface SearchModalType {
  type: string;
  carSpaceClass?: string;
}

export interface MapModalType {
  type: string;
}

export interface CommonFileUploadProp {
  maxFiles?: number;
  multiple?: boolean;
  body?: boolean;
}

export interface BlogBoxType {
  title: string;
  author: string;
  date: string;
  views: string;
  summary: string;
  image: string;
  authorImage: string;
  fireBox?: boolean;
  masonry: string;
}

export interface BlogGridBoxType {
  data: BlogBoxType;
  type?: string;
  index?: number;
}

export interface BlogGridViewType {
  cardShow?: number;
  side?: string;
  gridSize?: number;
  type?: string;
  sectionClass?: string;
  topSlider?: boolean;
}

export interface InputBoxType {
  label?: string;
  placeholder?: string;
  inputType?: InputType;
  review?: boolean;
  button?: string;
  input?: boolean;
  ColClass?: string;
  mainClass?: string;
  inputClass?: string;
  name?: string;
  id?: string;
  value?: string;
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
  rightText?: string;
  leftText?: string;
}

export interface RadioGroupType {
  name: string;
  labels: string[];
  ids: string[];
  label: string;
}

export interface FeatureItemType {
  label: string;
  name: string;
}

export interface IconLinkList {
  url: string;
  icon: string;
}