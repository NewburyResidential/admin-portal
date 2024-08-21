// utils
import { flattenArray } from 'src/utils/flatten-array';

// ----------------------------------------------------------------------

export function getAllItems({ data, roles }) {
  const reduceItems = data.map((list) => handleLoop(list.items, list.subheader)).flat();

  const items = flattenArray(reduceItems)
    .map((option) => {

      if (option.roles && option.roles.length && !roles.includes('admin')) {
        const isRole = option.roles.some((role) => roles.includes(role));
        if (!isRole) return false;
      }
      const group = splitPath(reduceItems, option.path);

      return {
        group: group && group.length > 1 ? group[0] : option.subheader,
        title: option.title,
        path: option.path,
      };
    })
    .filter((item) => item); // Ensures only truthy values are returned

  return items;
}

// ----------------------------------------------------------------------

export function applyFilter({ inputData, query }) {
  if (query) {
    inputData = inputData.filter(
      (item) => item.title.toLowerCase().indexOf(query.toLowerCase()) !== -1 || item.path.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return inputData;
}

// ----------------------------------------------------------------------

export function splitPath(array, key) {
  let stack = array.map((item) => ({
    path: [item.title],
    currItem: item,
  }));

  while (stack.length) {
    const { path, currItem } = stack.pop();

    if (currItem.path === key) {
      return path;
    }

    if (currItem.children?.length) {
      stack = stack.concat(
        currItem.children.map((item) => ({
          path: path.concat(item.title),
          currItem: item,
        }))
      );
    }
  }
  return null;
}

// ----------------------------------------------------------------------

export function handleLoop(array, subheader) {
  return array?.map((list) => ({
    subheader,
    ...list,
    ...(list.children && {
      children: handleLoop(list.children, subheader),
    }),
  }));
}

// ----------------------------------------------------------------------

export function groupedData(array) {
  const group = array.reduce((groups, item) => {
    groups[item.group] = groups[item.group] || [];

    groups[item.group].push(item);

    return groups;
  }, {});

  return group;
}
