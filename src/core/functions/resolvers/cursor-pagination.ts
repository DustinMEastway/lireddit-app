import { Resolver } from '@urql/exchange-graphcache';
import { stringifyVariables } from 'urql';

export function cursorPagination(): Resolver {
  return (_parent, fieldArgs, cache, info) => {
    const { fieldName, parentKey } = info;
    const fields = cache.inspectFields(parentKey).filter((field) =>
      field.fieldName === fieldName
    );

    if (!fields.length) {
      return;
    }

    const currentFieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    info.partial = !cache.resolveFieldByKey(parentKey, currentFieldKey);

    const allItemKeys = new Set<string>();
    let hasMore = true;
    fields.forEach((field) => {
      const listKey = cache.resolveFieldByKey(parentKey, field.fieldKey) as string;
      const itemKeys = cache.resolve(listKey, 'items') as string[];
      hasMore = hasMore && (cache.resolve(listKey, 'hasMore') as boolean);
      itemKeys.forEach(allItemKeys.add.bind(allItemKeys));
    });

    return {
      __typename: 'PostListOutput',
      hasMore,
      items: Array.from(allItemKeys.values())
    };
  };
}
