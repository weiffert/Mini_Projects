import java.lang.Math;

class Infix {
  public static int index = 0;

  public static Double calculate(String expression) throws Exception {
    return calculate(expression.split("[ ]+"));
  }

  public static Double calculate(String[] expression) throws Exception {
    Double one = null, two = null;
    String operator = ""; 
    while(index < expression.length && !expression[index].matches("[})\\]]")) {
      if (expression[index].matches("[{\\[(]")) {
        index++;
        if(one == null)
          one = calculate(expression);
        else if(two == null)
          two = calculate(expression);
        else
          throw new Exception("Invalid Expression");
      } else if (expression[index].matches("[+\\-/*^]") || expression[index].equals("sin") ||
        expression[index].equals("cos") || expression[index].equals("tan") ||
        expression[index].equals("sqrt") || expression[index].equals("log")) 
      {
        if(operator == "")
          operator = expression[index];
        else
          throw new Exception("Invalid Expression");
        index++;
      } else {
        if(one == null)
          one = Double.parseDouble(expression[index]);
        else if(two == null)
          two = Double.parseDouble(expression[index]);
        else 
          throw new Exception("Invalid Expression");
        index++;
      }
    }

    return evaluate(one, two, operator);
  }

  private static Double evaluate(Double one, Double two, String op) throws Exception {
    if(one != null && op == "")
      return one;
    else if(one == null || two == null || op == "") 
      throw new Exception("Invalid Expression");

    if (op.equals("+"))
      return one + two;
    else if (op.equals("-"))
      return one - two;
    else if (op.equals("*"))
      return one * two;
    else if (op.equals("/"))
      return one / two;
    else if (op.equals("^"))
      return Math.pow(one, two);
    else if (op.equals("sqrt"))
      return Math.sqrt(one);
    else if (op.equals("sin"))
      return Math.sin(one);
    else if (op.equals("cos"))
      return Math.cos(one);
    else if (op.equals("tan"))
      return Math.tan(one);
    else if (op.equals("log"))
      return Math.log(one);
    else
      throw new Exception("Invalid Expression");
  }

  public static void main(String[] args) {
    try {
      System.out.printf("%s\n", Infix.calculate(args[0]).toString());
    } catch(Exception e) {
        System.out.printf("%s\n", e.getMessage());
    }
  }
}
