function ochered(operations) {
  const queueState = {
    queue: [],
    countWorried: 0,
  };

  const commandHandlers = {
    COME: (k) => {
      if (k > 0) {
        queueState.queue.push(...Array(k).fill(false));
      } else if (k < 0) {
        queueState.queue.splice(k);
      }
    },
    WORRY: (i) => {
      queueState.queue[i] = true;
      queueState.countWorried++;
    },
    QUIET: (i) => {
      queueState.queue[i] = false;
      queueState.countWorried--;
    },
    WORRY_COUNT: () => queueState.countWorried,
  };

  const results = [];

  for (const operation of operations) {
    const [command, parameter] = operation.split(" ");
    const handler = commandHandlers[command];
    const result = handler(parameter && parseInt(parameter));

    if (result !== undefined) {
      results.push(result);
    }
  }

  return results;
}

const input = ["COME 5", "WORRY 1", "WORRY 4", "COME -2", "WORRY_COUNT", "COME 3", "WORRY 3", "WORRY_COUNT"];

const results = ochered(input);
results.forEach((result) => console.log(result));
