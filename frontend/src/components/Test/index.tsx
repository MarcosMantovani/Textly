import Post, { PostType } from '../Post'
import sdadsa from '../../assets/media/Foto LinkedIn.jpg'

const Mockup: PostType = {
  id: 1,
  body: 'Teste olha ai',
  created_at: '21/04/2024 11:10',
  number_of_likes: 10,
  likes: [1, 2],
  image: null,
  user: {
    id: 2,
    name: 'Marcos Mantovani',
    username: 'marcos',
    profile_photo:
      'https://www.rocketleague.com/images/keyart/rl_evergreen_16x9.jpg'
  },
  quoted_post: {
    id: 2,
    body: 'texto compartilhado',
    created_at: '21/04/2024 11:10',
    likes: [1, 2],
    image: 'https://www.rocketleague.com/images/keyart/rl_evergreen_16x9.jpg',
    number_of_likes: 1,
    user: {
      id: 3,
      name: 'teste compartilhado',
      username: 'teste',
      profile_photo:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSngZUeGHZNgQ5P4kaT1nrM_xtMH_b4IXGMxiYc0czAqw&s'
    }
  }
}

const Test = () => {
  return (
    <div>
      <Post postContent={Mockup} profile_id={2} />
    </div>
  )
}

export default Test
