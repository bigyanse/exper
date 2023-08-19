type TokenType = {
  type: number;
  value: any;
};

type NumberNode = {
  type: "number";
  left: TokenType;
};

type BinaryOpNode = {
  type: "binaryop";
  left: ASTNode;
  op: TokenType;
  right: ASTNode | TokenType;
};

type ASTNode = BinaryOpNode | NumberNode;

type Lexer = {
  i: number;
  tokens: TokenType[];
};

enum Token {
  INTEGER,
  PLUS,
  MINUS,
  STAR,
  SLASH,

  WHITESPACE,
  EOF
};

const getToken = (string: string, lexer: Lexer) => {
  const token: TokenType = { type: Token.EOF, value: '' };

  const char = string[lexer.i];
  switch (char) {
    case ' ':
      token.type = Token.WHITESPACE;
      break;
    case '+':
      token.type = Token.PLUS;
      token.value = char;
      break;
    case '-':
      token.type = Token.MINUS;
      token.value = char;
      break;
    case '*':
      token.type = Token.STAR;
      token.value = char;
      break;
    case '/':
      token.type = Token.SLASH;
      token.value = char;
      break;
    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
      let value = char;
      while(Number.isInteger(parseInt(string[lexer.i + 1]))) {
        value += ++lexer.i;
      }
      token.type = Token.INTEGER;
      token.value = parseInt(value);
      break;
    default:
      let error = "Unknown token!\n";
      error += string + "\n";
      for(let i = 0; i < lexer.i; i++) {
        error += " ";
      }
      error += "^";
      throw new Error(error);
  }

  return token;
};

const tokenize = (string: string) => {
  const lexer: Lexer = { i: 0, tokens: [] };
  for (lexer.i = 0; lexer.i < string.length; lexer.i++) {
    const token = getToken(string, lexer);
    if (token.type === Token.WHITESPACE) continue;
    lexer.tokens.push(token);
  }
  return lexer.tokens;
};

const parse = (tokens: TokenType[]) => {
  let left: ASTNode = { type: "number", left: tokens.shift() as TokenType };
  while((tokens.length > 0) && (tokens[0].type === Token.PLUS || tokens[0].type === Token.MINUS)) {
    const op = tokens.shift() as TokenType;
    const right = tokens.shift() as TokenType;
    const temp: BinaryOpNode = {
      type: "binaryop",
      left: left,
      op: op,
      right: right
    };
    left = temp;
  }
  return left;
};

const evaluate = (ast: ASTNode): number => {
  if(ast.type === "number") return ast.left.value;
  const right = (ast.right as TokenType).value;
  const left = evaluate(ast.left);
  if(ast.op.type === Token.PLUS) return left + right;
  else if(ast.op.type === Token.MINUS) return left - right;
  else if(ast.op.type === Token.STAR) return left * right;
  else return left / right;
};

const tokens = tokenize("11 - 2 * 3 + 4");
const ast = parse(tokens);
const result = evaluate(ast);
console.log(result);
