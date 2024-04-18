import Button from '../Button'

import { ReactComponent as ConfirmIcon } from '../../assets/media/checkmark-outline.svg'
import { ReactComponent as ImageIcon } from '../../assets/media/image-outline.svg'
import tempImg from '../../assets/media/Foto LinkedIn.jpg'

import * as S from './styles'

const NewPost = () => (
  <S.Container>
    <div className="sideIcons">
      <S.ProfilePhoto src={tempImg} alt="profilePhoto" />
      <Button title="" type="button" styled="post" icon={<ImageIcon />} />
      <Button title="" type="button" styled="post" icon={<ConfirmIcon />} />
    </div>
    <div className="postContent">
      <S.TextPost>
        <textarea className="newPostContainer" placeholder="Digite algo" />
      </S.TextPost>
    </div>
  </S.Container>
)

export default NewPost
