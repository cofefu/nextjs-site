import { withLayout } from '../../layout/Layout'
import { createClient } from '../../prismicio'


const News = ({articles}: any) => {
  return (
    <div>
      {
        articles.map((item: any) => (
          <div>
            {item.data.title} - {item.data.created_at}
            <div>
              {item.data.info[0].text.length > 40 ? item.data.info[0].text.slice(0, 40) + '...' : item.data.info[0].text}
            </div>
          </div>
        ))
      }
    </div>
  )
}

export async function getStaticProps({ params, previewData }: any) {
  const client = createClient({ previewData });

  const articles = await client.getAllByType('article');

  return {
    props: { articles },
  };
}

export default withLayout(News);