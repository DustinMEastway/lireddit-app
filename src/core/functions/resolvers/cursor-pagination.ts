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

    const entityIds = new Set<string>();
    fields.forEach((field) => {
      const fieldEntityIds = cache.resolveFieldByKey(parentKey, field.fieldKey) as string[];
      fieldEntityIds.forEach(entityIds.add.bind(entityIds));
    });

    const currentFieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    info.partial = !cache.resolveFieldByKey(parentKey, currentFieldKey);

    return Array.from(entityIds.values());
  };
}
