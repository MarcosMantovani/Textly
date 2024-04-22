import * as S from './styles'
import { Title } from '../Home/styles'
import { ReactComponent as SearchIcon } from '../../assets/media/magnifying-glass-svgrepo-com.svg'
import { ReactComponent as PersonIcon } from '../../assets/media/person-outline.svg'
import { ReactComponent as PostIcon } from '../../assets/media/email-outline.svg'
import Button from '../../components/Button'
import { useState } from 'react'

type SearchType = 'username' | 'name' | 'posts' | 'usuários'

const Search = () => {
  const [searchType, setSearchType] = useState<SearchType>('posts')

  return (
    <div className="container">
      <S.SearchContainer>
        <div className="inputContainer">
          <S.Input
            className="searchInput"
            type="text"
            placeholder={`Procurar por ${searchType}`}
          />
          <SearchIcon className="searchIcon" />
        </div>
        <div className="buttons">
          <Button
            type="button"
            styled="search"
            title="Post"
            icon={<PostIcon />}
            onClick={() => setSearchType('posts')}
            active={searchType === 'posts'}
          >
            Posts
          </Button>
          <Button
            type="button"
            styled="search"
            title="Post"
            icon={<PersonIcon />}
            onClick={() => setSearchType('usuários')}
            active={searchType === 'usuários'}
          >
            Usuários
          </Button>
        </div>
      </S.SearchContainer>
      <Title>PROCURAR</Title>
    </div>
  )
}

export default Search
