import { AccountRow, SubRow } from './gql';

export type EditableAccountRow = AccountRow & {
  edited: boolean;
  newMonthId: string;
};

export type EditableSubRow = SubRow & {
  group: string;
  subgroup: string;
};
