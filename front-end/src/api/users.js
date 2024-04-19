const {VITE_API_URL} = import.meta.env
export const getUsers = async () => {
  const userResponse = await fetch(`${VITE_API_URL}/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  })

  const userResponseJSON = await userResponse.json()

  return userResponseJSON.reduce((acc, u) => {
    acc[u.id] = u
    return acc
  }, {})
}