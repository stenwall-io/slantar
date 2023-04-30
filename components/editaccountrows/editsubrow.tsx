import useSWR from 'swr';
import { ReactElement, useState } from 'react';
import { ChangeEvent } from 'react';
import { Category } from 'types/gql';
import { EditableSubRow } from 'types/editables';

type Props = {
  rid: string;
  subRow: EditableSubRow;
  markRowEdited: () => void;
};

export default function EditSubRow({ rid, subRow, markRowEdited }: Props):ReactElement {
  const categoryData = useSWR('{ categories{ id group subgroup } }');

  const categoryGroups: string[] = [];

  const [groupState, setGroupState] = useState(
    subRow.category ? subRow.category.group : ''
  );
  const [subgroupState, setSubgroupState] = useState(
    subRow.category ? subRow.category.subgroup : ''
  );
  const [amountState, setAmountState] = useState(subRow.amountf);
  const [extraState, setExtraState] = useState(subRow.extra);
  const [subgroupOptions, setSubgroupOptions] = useState([]);

  if (categoryData.data) {
    categoryData.data.categories.forEach((category: Category) => {
      if (category.group && categoryGroups.indexOf(category.group) == -1)
        categoryGroups.push(category.group);
    });
  }

  const checkCategory = (group: string, subgroup: string) => {
    const newCategory = categoryData.data.categories
      .filter(
        (category: Category) => category.group == group && category.subgroup == subgroup
      )
      .pop();
    if (newCategory) {
      subRow.category = newCategory;
      subRow.group = null;
      subRow.subgroup = null;
    } else {
      // If no match then create a new category, somehow
      subRow.category = null;
      subRow.group = groupState;
      subRow.subgroup = subgroupState;
    }
    console.log(subRow.category);
  };

  const setGroup = (e: ChangeEvent<HTMLInputElement>) => {
    const groupInput = e.target.value;
    setGroupState(groupInput);
    markRowEdited();
    let newOptions = [];
    if (categoryGroups.indexOf(groupInput) !== -1) {
      newOptions = categoryData.data.categories
        .filter((category: Category) => {
          return category.group == groupInput;
        })
        .map((category: Category, i: number) => (
          <option key={i} value={category.subgroup} />
        ));
    }
    setSubgroupOptions(newOptions);
    checkCategory(groupInput, subgroupState);
  };
  const setSubgroup = (e: ChangeEvent<HTMLInputElement>) => {
    const newSubgroup = e.target.value;
    setSubgroupState(newSubgroup);
    checkCategory(groupState, newSubgroup);
    markRowEdited();
  };
  const setAmount = (e: ChangeEvent<HTMLInputElement>) => {
    setAmountState(e.target.value);
    subRow.amountf = e.target.value;
    markRowEdited();
  };
  function setExtra(e: ChangeEvent<HTMLInputElement>) {
    setExtraState(e.target.checked);
    subRow.extra = e.target.checked ? e.target.checked : false;
    markRowEdited();
  }

  return (
    <>
      <tr>
        <td>
          <input
            type="checkbox"
            value={extraState.toString()}
            onChange={setExtra}
          ></input>
        </td>
        <td>
          <input
            type="text"
            list="groups"
            placeholder={rid}
            value={groupState}
            onChange={setGroup}
          ></input>
          <datalist id="groups">
            {categoryGroups.map((group: string, i: number) => (
              <option key={i} value={group} />
            ))}
          </datalist>
        </td>

        <td>
          <input
            type="text"
            list={rid + 'subgroups'}
            placeholder={rid}
            value={subgroupState}
            onChange={setSubgroup}
          ></input>

          <datalist id={rid + 'subgroups'}>{subgroupOptions}</datalist>
        </td>

        <td>
          <input type="text" value={amountState} onChange={setAmount}></input>
        </td>
      </tr>
    </>
  );
}
