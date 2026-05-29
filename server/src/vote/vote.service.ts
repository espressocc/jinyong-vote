import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// 金庸人物初始数据
const INITIAL_CHARACTERS = [
  // 男主
  { id: 1, name: '令狐冲', novel: '笑傲江湖', gender: 'male', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_f3e348c6-fe5a-459c-9181-4ede9bbe7a08.jpeg?sign=1811554055-8b25f50b32-0-cf6c9a1dfa3c8b63f2230b8c30edc8cd745955752b880015f15bc43d997ced86' },
  { id: 2, name: '乔峰', novel: '天龙八部', gender: 'male', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_7f4c410b-b38a-45cf-b1fd-0eb49236f553.jpeg?sign=1811554051-0647d704c4-0-edd7e9b98a48a48b330183695513b9bbccc5bcfbd92d0c07e8b6faf61992e76c' },
  { id: 3, name: '杨过', novel: '神雕侠侣', gender: 'male', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_32d41e58-3029-42d9-875f-ab3568174a04.jpeg?sign=1811554053-f9babb5c21-0-80b48cb7a7d95c7d3b86a9cc9d2ca49dc5d57be6cd33f5c9061ae765b5eba0de' },
  { id: 4, name: '张无忌', novel: '倚天屠龙记', gender: 'male', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_1ca8b373-753f-4051-97b8-9617964555fa.jpeg?sign=1811554111-899d06aa1e-0-63b4672b3f45b23b461e0ec7db51eb5e6af3a26de79e94e3c575ef15376c69a5' },
  { id: 5, name: '郭靖', novel: '射雕英雄传', gender: 'male', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_1656e5a6-08a8-46e7-b323-c7f7a24e3647.jpeg?sign=1811554116-df586954b9-0-b8288693e9480b56888874eac1e1d32ad62a799dc34ebbd7ff9979ffe2cab360' },
  { id: 6, name: '段誉', novel: '天龙八部', gender: 'male', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_6f258d24-8264-4d31-b416-7af0a9fff8fa.jpeg?sign=1811554110-53eb153357-0-d33d47af4c76798c0520704b81cc9d49f969f8b1e1c4964f906045b262e60ecf' },
  { id: 7, name: '虚竹', novel: '天龙八部', gender: 'male', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_833b61f2-d4f0-46db-b273-2a9242c06e71.jpeg?sign=1811554167-29f5339bb6-0-e52251acde9c8b69808b80678a34bba01f6511a55625bdd93dddde643e014e58' },
  { id: 8, name: '韦小宝', novel: '鹿鼎记', gender: 'male', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_3d2035e4-80c6-41c7-b4d2-1ecf33997169.jpeg?sign=1811554156-a7eaaf1131-0-b5e128d250314f8fa920b3ff31d02de5f09ab7d8b1702a3696ad57454f8dc541' },
  { id: 9, name: '胡斐', novel: '飞狐外传', gender: 'male', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_924df8d0-29ca-41e1-ac7e-03c13764c8a5.jpeg?sign=1811554157-81a3ebc8aa-0-2eb1fcf1d96e000e74bd0dc2f9d3275d4fa1868947ed79393da410b90f06d059' },
  { id: 10, name: '陈家洛', novel: '书剑恩仇录', gender: 'male', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_23b60195-71a0-4aec-b4da-801eca77b6ef.jpeg?sign=1811554213-5b0d747a1a-0-4216be249ab5a074ec71e0b2b2071864b350ba99b7b21322583ef79b301e4899' },
  { id: 11, name: '狄云', novel: '连城诀', gender: 'male', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_8c51356f-e553-41d1-a06a-191ef732620b.jpeg?sign=1811564763-e8cfa1ee24-0-25df50fd7f00c39c532af433cd18507579773d77ab5af3290d36a338d6a53259' },
  { id: 12, name: '石破天', novel: '侠客行', gender: 'male', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_045edebc-f5d2-4662-b287-1c244dc811ef.jpeg?sign=1811564767-864782a4a4-0-8534a468bebcba5a65fbfd20f45a10f06d9f3d88964c52a6bc743a4bfd535907' },
  // 女主
  { id: 13, name: '黄蓉', novel: '射雕英雄传', gender: 'female', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_eedd22f5-5a38-465c-b828-bad403a1305e.jpeg?sign=1811554218-362f789b44-0-3bae29ec01b34dde73b2d72a83b8420c77af9af88b029665fa7db99dd6e5aebc' },
  { id: 14, name: '小龙女', novel: '神雕侠侣', gender: 'female', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_5470834b-7d64-4843-ad5f-f168d337475c.jpeg?sign=1811554213-60aaf375f7-0-784b44610f50418d3a3aff92cc863801b5e0ad32dd71ebb32f55b2be84d6f7b1' },
  { id: 15, name: '赵敏', novel: '倚天屠龙记', gender: 'female', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_0e9a8555-015e-4f11-bba2-af5f5446f147.jpeg?sign=1811554260-0dc14b0c24-0-a4d6728aea7e91f9ede44457ae10d5cbcf41889db5d6fa5be5c60f7839835cce' },
  { id: 16, name: '王语嫣', novel: '天龙八部', gender: 'female', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_4f305631-98f8-465a-aed9-410e73e70f11.jpeg?sign=1811554261-619bbb0f8c-0-cee5ba4aa653da9274e04ce219be9f0fd96a013ce33d6628f7c5aa5c494768bc' },
  { id: 17, name: '阿朱', novel: '天龙八部', gender: 'female', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_75a537ef-e7c9-42f4-b92c-9ee507c04786.jpeg?sign=1811554257-4d27331545-0-d1b8b72f48f3338750d6f67bc35aa39e07d62ebd4d84063e61570cbc9ec129c9' },
  { id: 18, name: '任盈盈', novel: '笑傲江湖', gender: 'female', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_fbddcd5e-b85b-4c51-bbc5-4df2c72d27ed.jpeg?sign=1811554321-9f8fa77233-0-054a484b3e761ad024e038fc9cf0106eda526ad7e9d0d051fa5bd780840f7db8' },
  { id: 19, name: '周芷若', novel: '倚天屠龙记', gender: 'female', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_5c26b1bb-42be-4868-9460-7f7fc4fc7958.jpeg?sign=1811554318-1eea1267b9-0-bda47bbba7d4b0c50d24d02474446751e6ef99df2a0445b235d48a09b83a3fcf' },
  { id: 20, name: '郭襄', novel: '神雕侠侣', gender: 'female', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_9d197fee-c6ab-4897-9a29-150565da6055.jpeg?sign=1811554308-f61a7a7445-0-92bf0c79f6fffb47d5c88139f29bd2574b7e73fda5b0915dec172c729fe9aa10' },
  { id: 21, name: '阿紫', novel: '天龙八部', gender: 'female', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_0cd7121b-64e4-4c42-b7d3-61a2c74a0dc8.jpeg?sign=1811554365-2231daf467-0-52a8b8ad3b2d479e1397d45077b697e98f660fe04106026339901ef6086b34f8' },
  { id: 22, name: '仪琳', novel: '笑傲江湖', gender: 'female', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_1a2897c9-4314-474c-9909-6992e9c90bc2.jpeg?sign=1811554365-0edb104cb5-0-e078b59edbc91b54db2a7374788cf7838da1fc0653ce3f95afb990a300ac3732' },
  { id: 23, name: '程灵素', novel: '飞狐外传', gender: 'female', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_ee85c11d-cfd3-4fa5-bb40-fea1e5e9ff89.jpeg?sign=1811564169-aea0b3ea10-0-fbfc204131bd46e309b6581a898a82456c416efe6af1b88d6d0504e7006eb49d' },
  { id: 24, name: '小昭', novel: '倚天屠龙记', gender: 'female', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_ca6ad081-d65c-4f4d-b3d7-b4a35d95975c.jpeg?sign=1811564168-ef7914ac47-0-d0e7424e69ed0f7c917631f745062a96da6859e693411739b3cb7977acb44126' },
  // 衡山派
  { id: 25, name: '莫大', novel: '笑傲江湖', gender: 'hengshan', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_b7d0d7cf-80af-4d61-900d-9d6b5dcdc99a.jpeg?sign=1811564382-21f36609b3-0-d4ba46e029a4649e0a11812b68d6c7e1b65e4403e7d158d67ad0178caa7d7156' },
  { id: 26, name: '刘正风', novel: '笑傲江湖', gender: 'hengshan', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_9b10f6b9-3d81-4a8e-a699-7424e47b7b59.jpeg?sign=1811564388-c67823b8ec-0-d81426582510d9c376679fb25e56a5a8f085675a0d6d78ec144164047bdb9abb' },
  { id: 27, name: '仪琳', novel: '笑傲江湖', gender: 'hengshan', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_61b4802f-f99e-4d05-835d-fb62dfb1d642.jpeg?sign=1811564382-14741f4cb8-0-6d21d59f0f9ed5859eb4ebb8950480cb476e6e3c1f9de662ba0c6a7ee72cf892' },
];

@Injectable()
export class VoteService {
  private client = getSupabaseClient();

  async getCharacters() {
    // 查询数据库中的人物数据
    const { data, error } = await this.client
      .from('jinyong_characters')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('查询人物数据失败:', error);
      throw new Error(`查询人物数据失败: ${error.message}`);
    }

    // 如果数据库为空，初始化数据
    if (!data || data.length === 0) {
      console.log('数据库为空，开始初始化人物数据...');
      await this.initializeCharacters();
      
      // 重新查询
      const { data: newData, error: newError } = await this.client
        .from('jinyong_characters')
        .select('*')
        .order('id', { ascending: true });
      
      if (newError) {
        throw new Error(`查询人物数据失败: ${newError.message}`);
      }
      
      return newData;
    }

    return data;
  }

  private async initializeCharacters() {
    // 批量插入初始数据
    const insertData = INITIAL_CHARACTERS.map(c => ({
      name: c.name,
      novel: c.novel,
      gender: c.gender,
      avatar_url: c.avatarUrl,
      votes_count: 0,
    }));

    const { error } = await this.client
      .from('jinyong_characters')
      .insert(insertData);

    if (error) {
      console.error('初始化人物数据失败:', error);
      throw new Error(`初始化人物数据失败: ${error.message}`);
    }

    console.log('人物数据初始化完成');
  }

  async vote(characterId: number) {
    // 先查询当前票数
    const { data: character, error: queryError } = await this.client
      .from('jinyong_characters')
      .select('votes_count')
      .eq('id', characterId)
      .maybeSingle();

    if (queryError) {
      console.error('查询票数失败:', queryError);
      throw new Error(`查询票数失败: ${queryError.message}`);
    }

    if (!character) {
      throw new Error('人物不存在');
    }

    // 更新票数
    const newVotesCount = (character.votes_count || 0) + 1;
    const { data, error: updateError } = await this.client
      .from('jinyong_characters')
      .update({ votes_count: newVotesCount })
      .eq('id', characterId)
      .select()
      .maybeSingle();

    if (updateError) {
      console.error('投票失败:', updateError);
      throw new Error(`投票失败: ${updateError.message}`);
    }

    return data;
  }

  // 获取某个人物的评论
  async getComments(characterId: number) {
    const { data, error } = await this.client
      .from('comments')
      .select('*')
      .eq('character_id', characterId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('查询评论失败:', error);
      throw new Error(`查询评论失败: ${error.message}`);
    }

    return data || [];
  }

  // 发表评论
  async addComment(characterId: number, content: string, nickname: string) {
    const { data, error } = await this.client
      .from('comments')
      .insert({
        character_id: characterId,
        content,
        nickname,
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error('发表评论失败:', error);
      throw new Error(`发表评论失败: ${error.message}`);
    }

    return data;
  }
}
