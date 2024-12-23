import User from '../models/user.model.js';

export const generatePredefinedUsers = async (req, res) => {
  const user1 = User.create({
    _id: '1',
    firstName: 'Alice',
    lastName: 'Freeman',
  });

  const user2 = User.create({
    _id: '2',
    firstName: 'Alice',
    lastName: 'Freeman',
  });

  const user3 = User.create({
    _id: '3',
    firstName: 'Alice',
    lastName: 'Freeman',
  });

  const results = await Promise.allSettled([user1, user2, user3]);

  try {
    const [user1, user2, user3] = handleResult(results);
    return res.status(201).json({ createdUsers: [user1, user2, user3] });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

function handleResult(results) {
  const errors = results
    .filter((result) => result.status === 'rejected')
    .map((result) => result.reason);

  if (errors.length) {
    throw new AggregateError(errors);
  }

  return results.map((result) => result.value);
}
