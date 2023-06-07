import { createClient } from '../../prismicio'
import { GetStaticPaths } from 'next'
import { withLayout } from '../../layout/Layout'

function Article({ article }: any) {
  console.log(article)
  return (<div>
    <h1>{article.data.title}</h1>
    <h3>{article.data.created_at}</h3>

    <div>

      {article.data.info[0].text}
    </div>
  </div>)
}

export async function getStaticProps({ params, previewData }: any) {
  const client = createClient({ previewData })

  const article = await client.getByUID('article', params.uid)

  return {
    props: { article }
  }
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {

  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking' //indicates the type of fallback
  }
}

export default withLayout(Article)