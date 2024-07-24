export class SelectListItem {
  Disabled?: boolean;
  //Group: string;
  Selected?: boolean;
  text: string;
  Value: string;
  Group?: {
    Name: string;
    Disabled: boolean;
  };

  constructor(
    disabled: boolean,
    group: any,
    selected: boolean,
    text: string,
    value: string
  ) {
    this.Disabled = disabled;
    this.Group = group;
    this.Selected = selected;
    this.text = text;
    this.Value = value;
  }
}
