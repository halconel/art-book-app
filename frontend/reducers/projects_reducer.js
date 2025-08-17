// No imports needed for this reducer

const projectsReducer = (state = {}, action) => {
  Object.freeze(state);

  switch (action.type) {
    default:
      return state;
  }
};

export default projectsReducer;
