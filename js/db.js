// Supabase에서 데이터를 읽어 기존 data/*.js와 같은 모양으로 만든다. (읽기 전용 공개 키)
const SUPABASE_URL = 'https://qmevafndcgcrzpjcitxc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_LhfNrJMkafV31jTw_wC_Lg_koBWc_ya';

const select = async (table, query) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    headers: { apikey: SUPABASE_KEY },
  });
  if(!res.ok) throw new Error(`${table} 데이터를 불러오지 못했습니다 (${res.status})`);
  return res.json();
};

export const imageUrl = (path) => path && `${SUPABASE_URL}/storage/v1/object/public/images/${encodeURIComponent(path).replaceAll('%2F', '/')}`;

// Notion 날짜("2018년 4월 1일 → 2018년 4월 2일")를 사이트 표기("2018년 04월 01일부터 이틀동안")로 바꾼다.
const DAYS = ['하루', '이틀', '사흘', '나흘', '닷새', '엿새', '이레', '여드레', '아흐레', '열흘'];
const formatDate = (text) => {
  const dates = (text ?? '').split('→').map((part) => part.trim().match(/^(\d+)년 (\d+)월 (\d+)일$/));
  if(!dates.length || dates.some((date) => !date)) return text;
  const [start, end = start] = dates.map(([, y, m, d]) => new Date(Date.UTC(y, m - 1, d)));
  const days = Math.round((end - start) / 86400000) + 1;
  const [, y, m, d] = dates[0];
  return `${y}년 ${m.padStart(2, '0')}월 ${d.padStart(2, '0')}일${days > 1 ? `부터 ${DAYS[days - 1] ?? `${days}일`}동안` : ' 하루동안'}`;
};

const group = (rows, key, value) => {
  const result = {};
  for(const row of rows) {
    result[row[key]] ??= {};
    result[row[key]][row.name] = value(row);
  }
  return result;
};

export const loadAwards = async () => group(
  await select('awards', 'select=*&order=id'), 'year',
  ({ prize, team, members, date, image }) => ({ prize, team, members, date: formatDate(date), image }),
);

export const loadMembers = async () => group(
  await select('members', 'select=*&order=id'), 'lunaGeneration',
  (row) => ({
    description: row.description ?? '',
    position: row.position,
    class: [row.generation, row.class].filter(Boolean).join(' '),
    image: row.image,
  }),
);

export const loadProjects = async () => group(
  await select('projects', 'select=*&order=id'), 'year',
  ({ description, image, awards }) => ({ description: description ?? '', image, awards }),
);

export const loadQnas = async () => Object.fromEntries(
  (await select('faq', 'select=question,answer&order=order')).map(({ question, answer }) => [question, answer]),
);
