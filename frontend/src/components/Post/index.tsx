import { ReactComponent as LikeIcon } from '../../assets/media/heart-outline.svg'
import { ReactComponent as MessageIcon } from '../../assets/media/message-circle-outline.svg'
import tempImg from '../../assets/media/Foto LinkedIn.jpg'
import tempImg2 from '../../assets/media/rl_evergreen_16x9.jpg'

import Button from '../Button'

import * as S from './styles'

const Post = () => (
  <S.Container>
    <div className="sideIcons">
      <S.ProfilePhoto src={tempImg} alt="Profile Photo" />
      <Button title="" type="button" styled="post" icon={<LikeIcon />} />
      <Button title="" type="button" styled="post" icon={<MessageIcon />} />
    </div>
    <div className="postContent">
      <S.TextPost>
        <div className="postHeader">
          <div>
            <S.Name className="name">Marcos Mantovani</S.Name>
            <S.Username>@Marcospider</S.Username>
          </div>
          <p className="time">10 h</p>
        </div>
        <div className="content">
          <p>
            Texto comprido de tweet bla bla bla aksjdakdna salkfmdskd
            sldmdalkdma dmsodalkdma dolsmadl dlsmdmsda dasaldmaldm dsaldalsdmad
            asas a sasas asasas asaasasasa sasas asasasas asasasa saasas as
            asasas asasasa sas asaa asas asasas asasas asasas asasas asasa asas
            asas asas as asas as a sas ass
          </p>
          <img src={tempImg2} alt="Post Image" />
        </div>
      </S.TextPost>
    </div>
  </S.Container>
)

export default Post
