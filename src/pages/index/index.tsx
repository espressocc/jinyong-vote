import { View, Text, Image } from '@tarojs/components';
import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { Network } from '@/network';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// 金庸人物数据（头像URL来自AI生成）
const CHARACTERS = [
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
  // 女主
  { id: 11, name: '黄蓉', novel: '射雕英雄传', gender: 'female', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_eedd22f5-5a38-465c-b828-bad403a1305e.jpeg?sign=1811554218-362f789b44-0-3bae29ec01b34dde73b2d72a83b8420c77af9af88b029665fa7db99dd6e5aebc' },
  { id: 12, name: '小龙女', novel: '神雕侠侣', gender: 'female', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_5470834b-7d64-4843-ad5f-f168d337475c.jpeg?sign=1811554213-60aaf375f7-0-784b44610f50418d3a3aff92cc863801b5e0ad32dd71ebb32f55b2be84d6f7b1' },
  { id: 13, name: '赵敏', novel: '倚天屠龙记', gender: 'female', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_0e9a8555-015e-4f11-bba2-af5f5446f147.jpeg?sign=1811554260-0dc14b0c24-0-a4d6728aea7e91f9ede44457ae10d5cbcf41889db5d6fa5be5c60f7839835cce' },
  { id: 14, name: '王语嫣', novel: '天龙八部', gender: 'female', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_4f305631-98f8-465a-aed9-410e73e70f11.jpeg?sign=1811554261-619bbb0f8c-0-cee5ba4aa653da9274e04ce219be9f0fd96a013ce33d6628f7c5aa5c494768bc' },
  { id: 15, name: '阿朱', novel: '天龙八部', gender: 'female', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_75a537ef-e7c9-42f4-b92c-9ee507c04786.jpeg?sign=1811554257-4d27331545-0-d1b8b72f48f3338750d6f67bc35aa39e07d62ebd4d84063e61570cbc9ec129c9' },
  { id: 16, name: '任盈盈', novel: '笑傲江湖', gender: 'female', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_fbddcd5e-b85b-4c51-bbc5-4df2c72d27ed.jpeg?sign=1811554321-9f8fa77233-0-054a484b3e761ad024e038fc9cf0106eda526ad7e9d0d051fa5bd780840f7db8' },
  { id: 17, name: '周芷若', novel: '倚天屠龙记', gender: 'female', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_5c26b1bb-42be-4868-9460-7f7fc4fc7958.jpeg?sign=1811554318-1eea1267b9-0-bda47bbba7d4b0c50d24d02474446751e6ef99df2a0445b235d48a09b83a3fcf' },
  { id: 18, name: '郭襄', novel: '神雕侠侣', gender: 'female', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_9d197fee-c6ab-4897-9a29-150565da6055.jpeg?sign=1811554308-f61a7a7445-0-92bf0c79f6fffb47d5c88139f29bd2574b7e73fda5b0915dec172c729fe9aa10' },
  { id: 19, name: '阿紫', novel: '天龙八部', gender: 'female', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_0cd7121b-64e4-4c42-b7d3-61a2c74a0dc8.jpeg?sign=1811554365-2231daf467-0-52a8b8ad3b2d479e1397d45077b697e98f660fe04106026339901ef6086b34f8' },
  { id: 20, name: '仪琳', novel: '笑傲江湖', gender: 'female', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_1a2897c9-4314-474c-9909-6992e9c90bc2.jpeg?sign=1811554365-0edb104cb5-0-e078b59edbc91b54db2a7374788cf7838da1fc0653ce3f95afb990a300ac3732' },
];

interface CharacterWithVotes {
  id: number;
  name: string;
  novel: string;
  gender: string;
  avatarUrl: string;
  votesCount: number;
}

const VOTED_STORAGE_KEY = 'jinyong_voted_characters';

const IndexPage = () => {
  const [characters, setCharacters] = useState<CharacterWithVotes[]>([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState<number | null>(null);
  const [votedIds, setVotedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    // 从 localStorage 读取已投票的人物ID
    const stored = Taro.getStorageSync(VOTED_STORAGE_KEY) || [];
    setVotedIds(new Set(stored));
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    try {
      setLoading(true);
      const res = await Network.request({ url: '/api/characters' });
      console.log('获取人物数据:', res.data);
      
      if (res.data?.data) {
        // 转换字段名（数据库使用下划线，前端使用驼峰）
        const convertedData = res.data.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          novel: item.novel,
          gender: item.gender,
          avatarUrl: item.avatar_url,
          votesCount: item.votes_count,
        }));
        setCharacters(convertedData);
      }
    } catch (error) {
      console.error('获取人物数据失败:', error);
      // 如果接口失败，使用默认数据（票数为0）
      setCharacters(CHARACTERS.map(c => ({ ...c, votesCount: 0 })));
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (characterId: number) => {
    // 检查是否已投票
    if (votedIds.has(characterId)) {
      Taro.showToast({
        title: '已经投过票了',
        icon: 'none',
        duration: 1500
      });
      return;
    }

    try {
      setVoting(characterId);
      const res = await Network.request({
        url: '/api/characters/vote',
        method: 'POST',
        data: { characterId }
      });
      console.log('投票结果:', res.data);
      
      if (res.data?.data) {
        // 更新票数
        setCharacters(prev => 
          prev.map(c => 
            c.id === characterId 
              ? { ...c, votesCount: res.data.data.votes_count }
              : c
          )
        );
        
        // 记录已投票
        const newVotedIds = new Set(votedIds);
        newVotedIds.add(characterId);
        setVotedIds(newVotedIds);
        Taro.setStorageSync(VOTED_STORAGE_KEY, Array.from(newVotedIds));
        
        Taro.showToast({
          title: '投票成功！',
          icon: 'success',
          duration: 1500
        });
      }
    } catch (error) {
      console.error('投票失败:', error);
      Taro.showToast({
        title: '投票失败，请重试',
        icon: 'none',
        duration: 2000
      });
    } finally {
      setVoting(null);
    }
  };

  const maleCharacters = characters.filter(c => c.gender === 'male');
  const femaleCharacters = characters.filter(c => c.gender === 'female');
  const totalVotes = characters.reduce((sum, c) => sum + c.votesCount, 0);

  const renderCharacterGrid = (charList: CharacterWithVotes[]) => (
    <View className="grid grid-cols-2 gap-3 p-4">
      {charList.map(character => (
        <Card key={character.id} className="overflow-hidden">
          <CardContent className="p-3 flex flex-col items-center gap-2">
            {/* 头像 */}
            <View className="w-20 h-20 rounded-lg overflow-hidden">
              <Image
                className="w-full h-full"
                src={character.avatarUrl}
                mode="aspectFill"
              />
            </View>
            
            {/* 人物名 */}
            <Text className="block text-base font-semibold text-center">
              {character.name}
            </Text>
            
            {/* 作品名 */}
            <Text className="block text-xs text-gray-500 text-center">
              {character.novel}
            </Text>
            
            {/* 票数 */}
            <Badge variant="secondary" className="mt-1">
              <Text className="text-sm">{character.votesCount} 票</Text>
            </Badge>
            
            {/* 投票按钮 */}
            <Button
              size="sm"
              className="w-full mt-1"
              onClick={() => handleVote(character.id)}
              disabled={voting === character.id || votedIds.has(character.id)}
            >
              <Text className="text-sm">
                {votedIds.has(character.id) ? '已投票' : voting === character.id ? '投票中...' : '投票'}
              </Text>
            </Button>
          </CardContent>
        </Card>
      ))}
    </View>
  );

  if (loading) {
    return (
      <View className="w-full h-full flex items-center justify-center bg-amber-50">
        <Text className="block text-gray-600">加载中...</Text>
      </View>
    );
  }

  return (
    <View className="w-full min-h-full flex flex-col bg-amber-50">
      {/* 标题区 */}
      <View className="p-4 bg-white">
        <Text className="block text-xl font-bold text-center text-red-700">
          金庸江湖人物投票
        </Text>
        <Text className="block text-sm text-gray-500 text-center mt-1">
          选出你心中的江湖英雄
        </Text>
        <View className="flex justify-center mt-2">
          <Badge variant="outline" className="border-yellow-600">
            <Text className="text-sm text-yellow-700">总票数: {totalVotes}</Text>
          </Badge>
        </View>
      </View>
      
      <Separator />
      
      {/* Tabs 区 */}
      <Tabs defaultValue="male" className="flex-1">
        <TabsList className="w-full">
          <TabsTrigger value="male" className="flex-1">
            <Text className="text-base">男主角 ({maleCharacters.length})</Text>
          </TabsTrigger>
          <TabsTrigger value="female" className="flex-1">
            <Text className="text-base">女主角 ({femaleCharacters.length})</Text>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="male" className="flex-1">
          {renderCharacterGrid(maleCharacters)}
        </TabsContent>
        
        <TabsContent value="female" className="flex-1">
          {renderCharacterGrid(femaleCharacters)}
        </TabsContent>
      </Tabs>
      
      {/* 底部说明 */}
      <View className="p-4 bg-white border-t border-amber-200">
        <Text className="block text-xs text-gray-500 text-center">
          每个人物只能投一次票，请谨慎选择
        </Text>
      </View>
    </View>
  );
};

export default IndexPage;
