<template>
  <div>
    <br>
    <button
      @click="getFirstOption"
    >
      첫번째 상품 옵션
    </button>

    <button
      @click="getSecondOption"
    >
      두번째 상품 옵션
    </button>

    <br>

    <select
      v-for="(pItem, index) in selectList"
      :key="pItem.title"
      v-model="pItem.selectedValue"
      :disabled="index !== 0 && !selectList[index-1].selectedValue"
      @change="changeOption(index)"
    >
      <option
        value=""
        disabled="true"
      >
        {{ pItem.title }}
      </option>
      <option
        v-for="cItem in pItem.options"
        :key="cItem.value"
        :value="cItem.value"
        :disabled="cItem.remainCount && cItem.remainCount < 1"
      >
        {{ cItem.label }}
      </option>
    </select>
    <br>
    <span
      v-if="result"
    >
      결과 : {{ result }}
    </span>
  </div>
</template>
<script>
export default {
  name: 'TestComponent',
  components: {},
  data: () => ({
    selectList: [],
    countList: [],
    result: null
  }),
  created() {
    this.getFirstOption();
  },
  methods: {
    // 옵션 선택 시
    changeOption(depth) {
      // 결과 메시지 초기화
      this.result = '';

      // 상위 옵션 선택 시 하위 옵션 선택 값 초기화
      this.selectList = this.selectList.map((f, index) => depth < index ? {...f, selectedValue: ''} : {...f});

      // 선택한 옵션 배열 생성
      const selectedOptList = this.selectList.filter(f => f.selectedValue).map(f => f.selectedValue);

      // 재고 배열에서 선택한 옵션 포함하는 배열 찾기
      const remainCountList = this.countList.filter(f => f.combination.filter(c => selectedOptList.includes(c)).length === selectedOptList.length);
      console.log('remainCountList', remainCountList);
      // 옵션 선택 시 하위 옵션에 재고정보 추가
      if (depth < this.selectList.length - 1) {
        this.selectList[depth + 1].options = this.selectList[depth + 1].options.map((f) => {
          // 결국 필요했던 건 현재 반복을 돌고 있는 하위옵션 값 f를 가지고 있는 countList의 객체들
          // 이미 remainCountList에서 선택한 옵션의 배열로 필터링 하기 때문에 필요없는 필터링조건 -> x.combination.filter(c => selectedOptList.includes(c)).length === selectedOptList.length
          // 필터링 조건이 중복
          const targetObjList = remainCountList.filter(x => x.combination[depth + 1] === f.value);
          // 추려낸 재고배열을 선택한 옵션의 하위 옵션 별로 필터링
          // const targetObjList = remainCountList.filter((x) => {
          // return x.combination.filter(c => selectedOptList.includes(c)).length === selectedOptList.length && f.value === x.combination[depth + 1];
          // });
          console.log('targetObjList', targetObjList);
          // 필터링된 옵션의 재고수를 모두 더해서 품절여부를 파악
          const cnt = targetObjList.map(x => x.remainCount).reduce((arr, cur) => {
            return arr + cur;
          });
          return {
            label: targetObjList[0].combination[depth + 1] + (depth === this.selectList.length - 2 ? (cnt === 0 ? ' (품절)' : ' (' + cnt + '개 구매가능)') : (cnt !== null && cnt < 1 ? ' (품절)' : '')),
            value: targetObjList[0].combination[depth + 1],
            remainCount: cnt
          };
        });
        // 마지막 옵션 선택 시 결과 출력하기
      } else {
        this.result = this.selectList.reduce((acc, cur, index) => {
          return acc + cur.selectedValue + (index === this.selectList.length - 1 ? '' : ' / ');
        }, '');
      }
      ;
    },
    setData(groupListData, countListData) {
      const selectList = groupListData.map((f, index) => {
        return {
          ...f,
          // selectedValue 추가하기
          selectedValue: '',
          // 옵션 객체 수정
          options: f.options.map((c) => {
            // 해당 옵션의 재고 정보 추가 and 품절여부 파악
            let cnt = null;
            if (index === 0) {
              cnt = countListData.filter((x) => {
                return x.combination[index] === c;
              }).map(x =>
                x.remainCount
              ).reduce((arr, cur) => {
                return arr + cur;
              });
            }
            ;
            return {
              label: c + (cnt !== null && cnt < 1 ? ' (품절)' : ''),
              value: c,
              remainCount: cnt
            };
          })
        };
      });

      this.selectList = selectList;
      this.countList = countListData;
    },
    getFirstOption() {
      this.result = '';
      this.selectedOptions = [];

      this.$axios.get('https://apigen-server.herokuapp.com/api/621f2588d8d85b8d78eb3e64')
        .then((res) => {
          this.setData(res.data.data.groupList, res.data.data.countList);
        });
    },
    getSecondOption() {
      this.result = '';
      this.selectedOptions = [];

      this.$axios.get('https://apigen-server.herokuapp.com/api/62419aa64139ba24abb709e8')
        .then((res) => {
          const data = {
            countList: [
              {
                combination: [
                  '오랑우탄',
                  '아보카도',
                  '선물 포장',
                  '내일'
                ],
                remainCount: 0
              },
              {
                combination: [
                  '오랑우탄',
                  '아보카도',
                  '포장 안함',
                  '내일'
                ],
                remainCount: 0
              },
              {
                combination: [
                  '오랑우탄',
                  '아보카도',
                  '선물 포장',
                  '모레'
                ],
                remainCount: 1
              },
              {
                combination: [
                  '오랑우탄',
                  '아보카도',
                  '포장 안함',
                  '모레'
                ],
                remainCount: 0
              },
              {
                combination: [
                  '오랑우탄',
                  '사과',
                  '선물 포장',
                  '내일'
                ],
                remainCount: 1
              },
              {
                combination: [
                  '오랑우탄',
                  '사과',
                  '포장 안함',
                  '내일'
                ],
                remainCount: 0
              },
              {
                combination: [
                  '오랑우탄',
                  '사과',
                  '선물 포장',
                  '모레'
                ],
                remainCount: 0
              },
              {
                combination: [
                  '오랑우탄',
                  '사과',
                  '포장 안함',
                  '모레'
                ],
                remainCount: 1
              },
              {
                combination: [
                  '얼룩말',
                  '아보카도',
                  '선물 포장',
                  '내일'
                ],
                remainCount: 0
              },
              {
                combination: [
                  '얼룩말',
                  '아보카도',
                  '포장 안함',
                  '내일'
                ],
                remainCount: 0
              },
              {
                combination: [
                  '얼룩말',
                  '아보카도',
                  '선물 포장',
                  '모레'
                ],
                remainCount: 0
              },
              {
                combination: [
                  '얼룩말',
                  '아보카도',
                  '포장 안함',
                  '모레'
                ],
                remainCount: 0
              },
              {
                combination: [
                  '얼룩말',
                  '사과',
                  '선물 포장',
                  '내일'
                ],
                remainCount: 1
              },
              {
                combination: [
                  '얼룩말',
                  '사과',
                  '포장 안함',
                  '내일'
                ],
                remainCount: 5
              },
              {
                combination: [
                  '얼룩말',
                  '사과',
                  '선물 포장',
                  '모레'
                ],
                remainCount: 0
              },
              {
                combination: [
                  '얼룩말',
                  '사과',
                  '포장 안함',
                  '모레'
                ],
                remainCount: 5
              }
            ],
            titleList: [
              '동물 선택',
              '과일 선택',
              '포장 선택',
              '발송 날짜'
            ],
            groupList: [
              {
                title: '동물 선택',
                options: [
                  '오랑우탄',
                  '얼룩말'
                ]
              },
              {
                title: '과일 선택',
                options: [
                  '아보카도',
                  '사과'
                ]
              },
              {
                title: '포장 선택',
                options: [
                  '선물 포장',
                  '포장 안함'
                ]
              },
              {
                title: '발송 날짜',
                options: [
                  '내일',
                  '모레'
                ]
              }
            ]
          };
          // this.setData(res.data.data.groupList, res.data.data.countList);
          this.setData(data.groupList, data.countList);
        });
    }
  }
};
</script>
