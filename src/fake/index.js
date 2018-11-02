import _ from 'lodash';
import faker from 'faker';

export const buildFakeCollection = (
  known,
  getFake,
  count,
  idField = 'id',
  orderBy = null,
  orderKnow = false
) => {
  const generated = _.range(count).map(() => getFake(faker.random.uuid()));
  const list = !orderBy
    ? [...known, ...generated]
    : [
      ...(orderKnow ? [] : known),
      ..._.sortBy([...(orderKnow ? known : []), ...generated], orderBy),
    ];

  return _.keyBy(list, idField);
};

export const buildCrudResolvers = ({
  name,
  pluralName,
  repo,
}) => ({
  Query: {
    [pluralName]: () => repo.findAll(),
    [name]: (_, { id }) => repo.findOne({ id }),
  },
  Mutation: {
    [`create${_.upperFirst(name)}`]: (_, { item }) => repo.create({ id: faker.random.uuid(), ...item }),
    [`update${_.upperFirst(name)}`]: (_, { id, item }) => repo.update({ id, ...item }),
    [`remove${_.upperFirst(name)}`]: (_, { id }) => repo.remove({ id }),
  },
});
