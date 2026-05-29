import { View, Text, Image } from '@tarojs/components';
import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { Network } from '@/network';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
  { id: 21, name: '木婉清', novel: '天龙八部', gender: 'female', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_7b64e2f8-2f6e-4a1e-9bc9-cb9a7e8f9d1a.jpeg?sign=1811554365-2231daf467-0-52a8b8ad3b2d479e1397d45077b697e98f660fe04106026339901ef6086b34f8' },
  { id: 22, name: '程灵素', novel: '飞狐外传', gender: 'female', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_ee85c11d-cfd3-4fa5-bb40-fea1e5e9ff89.jpeg?sign=1811564169-aea0b3ea10-0-fbfc204131bd46e309b6581a898a82456c416efe6af1b88d6d0504e7006eb49d' },
  { id: 23, name: '小昭', novel: '倚天屠龙记', gender: 'female', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_ca6ad081-d65c-4f4d-b3d7-b4a35d95975c.jpeg?sign=1811564168-ef7914ac47-0-d0e7424e69ed0f7c917631f745062a96da6859e693411739b3cb7977acb44126' },
  // 衡山派
  { id: 24, name: '莫大', novel: '笑傲江湖', gender: 'hengshan', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_b7d0d7cf-80af-4d61-900d-9d6b5dcdc99a.jpeg?sign=1811564382-21f36609b3-0-d4ba46e029a4649e0a11812b68d6c7e1b65e4403e7d158d67ad0178caa7d7156' },
  { id: 25, name: '刘正风', novel: '笑傲江湖', gender: 'hengshan', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_9b10f6b9-3d81-4a8e-a699-7424e47b7b59.jpeg?sign=1811564388-c67823b8ec-0-d81426582510d9c376679fb25e56a5a8f085675a0d6d78ec144164047bdb9abb' },
  { id: 26, name: '仪琳', novel: '笑傲江湖', gender: 'hengshan', avatarUrl: 'https://coze-coding-project.tos.coze.site/coze_storage_7645089141197373459/image/generate_image_61b4802f-f99e-4d05-835d-fb62dfb1d642.jpeg?sign=1811564382-14741f4cb8-0-6d21d59f0f9ed5859eb4ebb8950480cb476e6e3c1f9de662ba0c6a7ee72cf892' },
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
  const hengshanCharacters = characters.filter(c => c.gender === 'hengshan');
  const totalVotes = characters.reduce((sum, c) => sum + c.votesCount, 0);

  const renderCharacterGrid = (charList: CharacterWithVotes[]) => (
    <View className="grid grid-cols-2 gap-4 p-4">
      {charList.map((character) => {
        const isVoted = votedIds.has(character.id);
        const isVoting = voting === character.id;
        
        return (
          <Card 
            key={character.id} 
            className="overflow-hidden shadow-lg border-2 border-amber-200 bg-gradient-to-br from-white to-amber-50"
          >
            <CardContent className="p-4 flex flex-col items-center gap-3">
              {/* 头像容器 - 圆形带装饰边框 */}
              <View className="relative">
                {/* 外圈装饰 */}
                <View className="absolute -inset-1 rounded-full bg-gradient-to-r from-red-400 via-amber-400 to-red-400 opacity-60" />
                {/* 头像 */}
                <View className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white">
                  <Image
                    className="w-full h-full"
                    src={character.avatarUrl}
                    mode="aspectFill"
                  />
                </View>
                {/* 角标 - 已投票 */}
                {isVoted && (
                  <View className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center border-2 border-white">
                    <Text className="text-white text-xs">✓</Text>
                  </View>
                )}
              </View>
              
              {/* 人物名 - 加大加粗 */}
              <Text className="block text-lg font-bold text-center text-gray-800">
                {character.name}
              </Text>
              
              {/* 作品名 - 斜体样式 */}
              <Text className="block text-xs text-gray-500 text-center italic">
                「{character.novel}」
              </Text>
              
              {/* 票数徽章 - 渐变背景 */}
              <View className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-amber-200 border border-amber-300">
                <Text className="text-sm font-medium text-amber-700">
                  {character.votesCount}
                </Text>
                <Text className="text-xs text-amber-600">票</Text>
              </View>
              
              {/* 投票按钮 - 渐变 + 阴影 */}
              <Button
                size="sm"
                className={`w-full mt-1 rounded-full shadow-md transition-all ${
                  isVoted 
                    ? 'bg-gray-300 text-gray-500' 
                    : isVoting
                    ? 'bg-amber-300 text-white'
                    : 'bg-gradient-to-r from-red-500 to-amber-500 text-white'
                }`}
                style={{
                  background: isVoted 
                    ? undefined 
                    : isVoting 
                    ? undefined 
                    : 'linear-gradient(135deg, #dc2626 0%, #f59e0b 100%)'
                }}
                onClick={() => handleVote(character.id)}
                disabled={isVoting || isVoted}
              >
                <Text className="text-sm font-medium">
                  {isVoted ? '已投票' : isVoting ? '投票中...' : '投票'}
                </Text>
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </View>
  );

  if (loading) {
    return (
      <View className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-red-50">
        {/* 加载动画 */}
        <View className="relative w-16 h-16 mb-4">
          <View className="absolute inset-0 rounded-full border-4 border-amber-200" />
          <View className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
        </View>
        <Text className="block text-gray-600 text-lg">江湖英雄集结中...</Text>
      </View>
    );
  }

  return (
    <View className="w-full min-h-full flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* 标题区 - 渐变背景 + 装饰 */}
      <View 
        className="relative p-6 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #f59e0b 100%)'
        }}
      >
        {/* 装饰圆圈 */}
        <View className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white" style={{ opacity: 0.1 }} />
        <View className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-white" style={{ opacity: 0.05 }} />
        
        {/* 主标题 */}
        <Text className="block text-2xl font-bold text-center text-white mb-2 tracking-wider">
          金庸江湖人物投票
        </Text>
        
        {/* 副标题 */}
        <Text className="block text-sm text-white text-center mb-3" style={{ opacity: 0.8 }}>
          选出你心中的江湖英雄
        </Text>
        
        {/* 总票数 - 徽章样式 */}
        <View className="flex justify-center">
          <View className="px-4 py-2 rounded-full bg-white backdrop-blur-sm border border-white" style={{ opacity: 0.9 }}>
            <Text className="text-sm text-white font-medium">
              总票数: {totalVotes}
            </Text>
          </View>
        </View>
      </View>
      
      {/* 分隔装饰 */}
      <View 
        className="h-1"
        style={{
          background: 'linear-gradient(90deg, transparent, #f59e0b, transparent)'
        }}
      />
      
      {/* Tabs 区 */}
      <Tabs defaultValue="male" className="flex-1">
        <TabsList className="w-full bg-white backdrop-blur-sm" style={{ opacity: 0.8 }}>
          <TabsTrigger 
            value="male" 
            className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
          >
            <Text className="text-sm font-medium">男主 ({maleCharacters.length})</Text>
          </TabsTrigger>
          <TabsTrigger 
            value="female" 
            className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
          >
            <Text className="text-sm font-medium">女主 ({femaleCharacters.length})</Text>
          </TabsTrigger>
          <TabsTrigger 
            value="hengshan" 
            className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
          >
            <Text className="text-sm font-medium">衡山派 ({hengshanCharacters.length})</Text>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="male" className="flex-1">
          {renderCharacterGrid(maleCharacters)}
        </TabsContent>
        
        <TabsContent value="female" className="flex-1">
          {renderCharacterGrid(femaleCharacters)}
        </TabsContent>
        
        <TabsContent value="hengshan" className="flex-1">
          {renderCharacterGrid(hengshanCharacters)}
        </TabsContent>
      </Tabs>
      
      {/* 底部说明 - 毛玻璃效果 */}
      <View className="p-4 bg-white backdrop-blur-sm border-t border-amber-200" style={{ opacity: 0.9 }}>
        <View className="flex items-center justify-center gap-2">
          <View className="w-2 h-2 rounded-full bg-amber-400" />
          <Text className="block text-xs text-gray-500 text-center">
            每个人物只能投一次票，请谨慎选择
          </Text>
          <View className="w-2 h-2 rounded-full bg-amber-400" />
        </View>
      </View>
    </View>
  );
};

export default IndexPage;
