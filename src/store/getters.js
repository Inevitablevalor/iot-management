const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  username: state => state.user.name,
  introduction: state => state.user.introduction,
  email: state => state.user.email
}
export default getters
