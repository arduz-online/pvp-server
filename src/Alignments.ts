import { BasicAlignment } from "@arduz/Connections";

@Component("alignment")
export class Alignment implements BasicAlignment {
  constructor(public readonly id: string, public readonly color: string, public readonly name: string) {}
}

export const RED_TEAM = new Alignment("red", "#ff0000", "Chaotic");
export const BLUE_TEAM = new Alignment("blue", "#0000ff", "Lawful");
